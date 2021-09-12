import { ArchivedObject } from "./ArchivedObject";
import { IDecodeable } from "./IDecodeable";

/** Delegate for packing/unpacking NS(Mutable)Dictionary objects
 * @devdoc This code has not yet been used or tested and is just provided for completeness's sake with regards to the
 * aforementioned python project
 */
export class DictArchive implements IDecodeable {
    /** @inheritdoc */
    decode_archive(archive_obj: ArchivedObject): any {
        var key_uids = archive_obj.decode("NS.keys");
        var val_uids = archive_obj.decode("NS.objects");

        var count: number = key_uids.length;
        var d: { [id: number]: any } = {};

        for (const i in Array(count).keys()) {
            //TODO does this conversion work?
            const idx = i as unknown as number;
            archive_obj.decode_index(idx);

            var key = archive_obj.decode_index(key_uids[idx]);
            var val = archive_obj.decode_index(val_uids[idx]);
            d[key] = val;
        }

        return d;
    }
}
