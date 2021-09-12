import { Unarchiver } from "./Unarchiver";

/* Defines an Unarchiver for keyed property lists*/
interface INSKeyedUnarchiver {
    /** Decodes a previously-archived object graph, and returns the root object.
     * @param propertyList - An object graph previously encoded by NSKeyedArchiver (as an "object" property list).
     * E.g. like the output from https://github.com/joeferner/node-bplist-parser
     * @returns The unarchived object, or nil if an error occurred.
     * @remarks This method throws an error if the property list does not contain valid keyed data.
     * @devdoc This method implements the method from https://developer.apple.com/documentation/foundation/nskeyedunarchiver/2919664-unarchivetoplevelobjectwithdata
     */
    unarchive(propertyList: any[]): any;
}

/** A simple NSKeyedUnarchiver (implmented and tested only to work with a property list from the LivePlayback iOS App).
 * @remarks This implementation has been specifically created for the above task, and in no way a complete solution. Feel free to fork or suggest improvements.
 * @devdoc This work is heavily based on a similar project for python. The same limitations as stated there apply to the current
 * state of this projet, especially for circular references. Also, the UID type is not implemented, the number type is used.
 * See https://github.com/parabolala/bpylist2 for more details
 * Only some of the there mentioned NS-types are implemented at this time, and some specific classes for the task at hand are additionally provided.
 * Ideas are also taken from the blog entry by https://digitalinvestigation.wordpress.com/2012/04/04/geek-post-nskeyedarchiver-files-what-are-they-and-how-can-i-use-them/
 * See also the documentation from Apple: https://developer.apple.com/documentation/foundation/nskeyedunarchiver
 */
export default class NSKeyedUnarchiver implements INSKeyedUnarchiver {
    /** @inheritdoc */
    unarchive(propertyList: any[]): any {
        const unarchiver = new Unarchiver(propertyList);
        return unarchiver.top_object();
    }
}
