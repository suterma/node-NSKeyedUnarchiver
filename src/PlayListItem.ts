import { ArchivedObject } from "./ArchivedObject";
import { IDecodeable } from "./IDecodeable";
/** Delegate for packing/unpacking (LivePlayback) PlayListItem objects
 * @remarks This class has an archive structure like in the example below
 * @example <caption>LivePlayback PlayListItem</caption>
 * {
 *     $class: { UID: 21 },
 *     TDuration: { UID: 48 },
 *     TData: { UID: 69 },
 *     TName: { UID: 47 },
 *     TMarkers: { UID: 49 },
 *     TShortCut: { UID: 18 },
 *     TPath: { UID: 43 },
 * },
 */
export class PlayListItem implements IDecodeable {
    /** @inheritdoc */
    decode_archive(archive_obj: ArchivedObject): any {
        //Hint: the data property is intentionally left out because it is not used by downstream processing
        const decodedPlayListItem = {
            Duration: archive_obj.decode_index(
                (archive_obj.object as any).TDuration.UID
            ),
            Name: archive_obj.decode_index(
                (archive_obj.object as any).TName.UID
            ),
            Markers: archive_obj.decode_index(
                (archive_obj.object as any).TMarkers.UID
            ),
            ShortCut: archive_obj.decode_index(
                (archive_obj.object as any).TShortCut.UID
            ),
            Path: archive_obj.decode_index(
                (archive_obj.object as any).TPath.UID
            ),
        };

        return decodedPlayListItem;
    }
}
