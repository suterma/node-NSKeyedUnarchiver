import { ArchivedObject } from "./ArchivedObject";

/** Defines a decodeable archived class */
export interface IDecodeable {
    /** The method to decode an instance of this decodeable class */
    decode_archive(archive_obj: ArchivedObject): any;
}
