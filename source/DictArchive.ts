import { ArchivedObject } from './ArchivedObject';
import { IDecodeable } from './IDecodeable';

/** Delegate for packing/unpacking NS(Mutable)Dictionary objects
 * @devdoc This code has not yet been used or tested and is just provided for completeness's sake with regards to the
 * aforementioned python project
 */
export class DictArchive implements IDecodeable {
    /** @inheritdoc */
    decode_archive(archive_obj: ArchivedObject): any {
        const key_uids = archive_obj.decode('NS.keys');
        const val_uids = archive_obj.decode('NS.objects');

        const count: number = key_uids.length;
        const dict: { [id: number]: any } = {};

        for (const i in Array(count).keys()) {
            const idx: number = i as unknown as number;
            archive_obj.decode_index(idx);

            const key = archive_obj.decode_index(key_uids[idx]);
            const val = archive_obj.decode_index(val_uids[idx]);
            dict[key] = val;
        }

        return dict;
    }
}
