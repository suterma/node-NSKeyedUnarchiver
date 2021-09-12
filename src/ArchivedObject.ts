import { IUnarchiver } from "./Unarchiver";

/** Stateful wrapper around IUnarchiver for an archived object.
 * @remarks This is the object that will be passed to unarchiving delegates
 * so that they can construct objects. The only useful method on
 * this class is decode(key).
 */
export class ArchivedObject {
    object: Object;
    unarchiver: IUnarchiver;

    /** Creates a new archived object, ready to be unarchived with the given unarchiver */
    constructor(obj: Object, unarchiver: IUnarchiver) {
        this.object = obj;
        this.unarchiver = unarchiver;
    }

    decode_index(index: number) {
        return this.unarchiver.decode_object(index);
    }

    decode(key: string): any {
        return this.unarchiver.decode_key(this.object, key);
    }
}
