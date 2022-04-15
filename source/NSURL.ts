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
export class NSURL implements IDecodeable {
    /** @inheritdoc */
    decode_archive(archive_obj: ArchivedObject): string {
        const decodedUrl = {
            Relative: archive_obj.decode_index(
                (archive_obj.object as any)["NS.relative"]?.UID
            ),
        };
        return decodedUrl?.Relative;
    }
}
