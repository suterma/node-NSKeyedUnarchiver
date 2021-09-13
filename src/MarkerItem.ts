import { ArchivedObject } from "./ArchivedObject";
import { IDecodeable } from "./IDecodeable";

/** Delegate for packing/unpacking (LivePlayback) MarkerItem objects
 * @remarks This class has an archive structure like in the example below
 * @example <caption>LivePlayback MarkerItem</caption>
 * {
 *     MName: { UID: 31 },
 *     MPosition: { UID: 12 },
 *     MShortCut: { UID: 32 },
 *     preroll: { UID: 12 },
 *     prerollEnabled: { UID: 15 },
 *     $class: { UID: 16 },
 * },
 */

export class MarkerItem implements IDecodeable {
    /** @inheritdoc */
    decode_archive(archive_obj: ArchivedObject): any {
        const decodedMarkerItem = {
            Name: archive_obj.decode_index(
                (archive_obj.object as any).MName.UID
            ),
            Position: archive_obj.decode_index(
                (archive_obj.object as any).MPosition.UID
            ),
            ShortCut: archive_obj.decode_index(
                (archive_obj.object as any).MShortCut.UID
            ),
            Preroll: archive_obj.decode_index(
                (archive_obj.object as any).preroll.UID
            ),
            PrerollEnabled: archive_obj.decode_index(
                (archive_obj.object as any).prerollEnabled.UID
            ),
        };
        return decodedMarkerItem;
    }
}
