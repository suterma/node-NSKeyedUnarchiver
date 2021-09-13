import { ArchivedObject } from "./ArchivedObject";
import { CycleToken } from "./CycleToken";
import { DictArchive } from "./DictArchive";
import { ListArchive } from "./ListArchive";
import { MarkerItem } from "./MarkerItem";
import { NSURL } from "./NSURL";
import { PlayListItem } from "./PlayListItem";

/** The NULL UID, for convenience */
const NULL_UID = 0;

/** The name of the supported Archiver */
const NSKeyedArchiver = "NSKeyedArchiver";

/** The version of the supported NSKeyedArchiver */
const NSKeyedArchiveVersion = 100000;

/** Defines an unarchiver for an archived object tree. */
export interface IUnarchiver {
    /** Decodes the object at the given key
     * @param object - The property item with the object data
     * @param key - The key to the object data
     */
    decode_key(obj: any, key: any): any;

    /** Decodes an object at the given object list index
     * @param index - The index into the raw object list
     */
    decode_object(index: number): any;
}

/** Capable of unpacking an archived object tree in the NSKeyedArchive format.
 * @devdoc See https://github.com/parabolala/bpylist2/blob/master/bpylist2/archiver.py for details
 */
export class Unarchiver implements IUnarchiver {
    public propertyList: any = undefined;
    public unpacked_uids: { [UID: number]: any } = {};
    public top_uid = NULL_UID;
    public objects: any[] = [];

    /** Creates a new unarchiver with the given archived object tree
     * @param propertyList - An object graph previously encoded by NSKeyedArchiver (as an "object" property list).
     * E.g. like the output from https://github.com/joeferner/node-bplist-parser
     * */
    public constructor(propertyList: any) {
        this.propertyList = propertyList;
        this.unpacked_uids = {};
        this.top_uid = NULL_UID;
        this.objects = [];
    }

    /** Unpacks and asserts the archive header */
    unpack_archive_header() {
        const archiver = this.propertyList[0].$archiver as String;
        if (archiver != NSKeyedArchiver) {
            throw new Error("UnsupportedArchiver(" + archiver + ")");
        }

        const version = this.propertyList[0].$version as number;
        if (version != NSKeyedArchiveVersion) {
            throw new Error("UnsupportedArchiveVersion(" + version + ")");
        }

        const top = this.propertyList[0].$top as any;
        if (top == undefined) {
            throw new Error("MissingTopObject(" + top + ")");
        }

        const top_uid = top.root.UID;
        if (top_uid == undefined) {
            throw new Error("MissingTopObjectUID(" + top_uid + ")");
        }
        this.top_uid = top_uid;

        this.objects = this.propertyList[0].$objects as any;
        if (this.objects == undefined) {
            throw new Error(
                "MissingObjectsArray(" + this.propertyList[0] + ")"
            );
        }
    }

    /** Defiens a mapping for classes to unarchive
     * @devdoc This mapping may be expanded by future implementaions
     */
    public UNARCHIVE_CLASS_MAP: { [className: string]: any } = {
        NSDictionary: DictArchive,
        NSArray: ListArchive,
        NSMutableArray: ListArchive,
        NSURL: NSURL,
        //TODO The following are yet to implement
        // NSMutableDictionary: DictArchive,
        // NSSet:               SetArchive,
        // NSMutableSet:        SetArchive,
        // NSDate:              timestamp,
        // NSMutableData: NSMutableData,

        //HINT: These two are specific for the downstream application
        PlayListItem: PlayListItem,
        MarkerItem: MarkerItem,
    };

    /** use the UNARCHIVE_CLASS_MAP to find the unarchiving delegate of a UID */
    class_for_uid(index: number): any {
        var meta = this.objects[index];

        //TODO we should assert the class meta data
        /*
        if (meta != typeof this.ARCHIVE_CLASS_MAP.dict) {
            //if not isinstance(meta, dict):
            throw new Error('MissingClassMetaData(index, meta)');
            //raise MissingClassMetaData(index, meta)
        }*/

        const name = meta.$classname;

        //TODO we should assert the class name
        /*
        if (name != typeof String) {
        if not isinstance(name, str):
        throw new Error('MissingClassName(meta)');
        raise MissingClassName(meta)
        }*/

        const klass = new this.UNARCHIVE_CLASS_MAP[name]();
        if (klass == undefined) {
            throw new Error("MissingClassMapping(name, UNARCHIVE_CLASS_MAP)");
        }

        return klass;
    }

    /** @inheritdoc */
    decode_key(obj: any, key: any): any {
        const val = obj[key];
        if (obj == typeof Number) {
            return this.decode_object(val);
        }
        return val;
    }

    /** @inheritdoc */
    decode_object(index: number): any {
        // index 0 always points to the $null object, which is the archive's
        // special way of saying the value is null/nil/none
        if (index == NULL_UID) {
            return null;
        }

        let obj = this.unpacked_uids[index];
        if (obj == typeof CycleToken) {
            throw new Error("CircularReference(index)");
        }

        //Is the object already unpacked?
        if (obj !== undefined) {
            return obj;
        }

        //The object requires unpacking...
        var raw_obj = this.objects[index] as any;

        // put a temp object in place, in case we have a circular
        // reference, which we do not really support
        this.unpacked_uids[index] = new CycleToken();

        // if obj is a (semi-)primitive type (e.g. str)
        if (raw_obj.$class == undefined /** no need to decode it's class */) {
            this.unpacked_uids[index] = obj;
            return raw_obj;
        }

        const class_uid = raw_obj.$class.UID;
        if (class_uid === undefined) {
            throw new Error("MissingClassUID(raw_obj)");
        }

        var klass = this.class_for_uid(class_uid);
        obj = klass.decode_archive(new ArchivedObject(raw_obj, this));

        this.unpacked_uids[index] = obj;
        return obj;
    }

    /** recursively decode the root/top object and return the result */
    top_object(): any {
        this.unpack_archive_header();
        return this.decode_object(this.top_uid);
    }
}
