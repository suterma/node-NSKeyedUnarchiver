import { ArchivedObject } from "./ArchivedObject";
import { IDecodeable } from "./IDecodeable";

/** Delegate for packing/unpacking NS(Mutable)Array objects
 */
export class ListArchive implements IDecodeable {
    /** @inheritdoc */
    decode_archive(archive_obj: ArchivedObject): any[] {
        const uids = archive_obj.decode("NS.objects");
        const decodedItems: any[] = [];

        uids.forEach((element: { UID: number }) => {
            const idx = element.UID;
            decodedItems.push(archive_obj.decode_index(idx));
        });

        return decodedItems;
    }
}
