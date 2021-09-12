# node-NSKeyedUnarchiver

A simple NSKeyedUnarchiver (implemented and tested only to work with data from the [LivePlayback](https://apps.apple.com/us/app/liveplayback/id469746819) iOS App).

## Usage

This unarchiver processes "object" property lists as provided by this [bplist-parser](https://github.com/joeferner/node-bplist-parser)

    import NSKeyedUnarchiver from "./src/NSKeyedUnarchiver";
    const inputPropertyList ...; //as provided by bplist-parser
    var unarchivedObject = new NSKeyedUnarchiver().unarchive(inputPropertyList);
    console.log(unarchivedObject);

See [demo.ts](https://github.com/suterma/node-NSKeyedUnarchiver/blob/main/demo.ts) for a working example

## Remarks / Limitations

This implementation has been specifically created for the above task, and is in no way a complete solution. Feel free to fork or suggest improvements.

-   No support for circular references.
-   The UID type is not implemented, the number type is used instead.
-   Only some of the NS-types are implemented at this time, and some specific classes for the task at hand are additionally provided.

## Credits

-   This work is heavily based on a [similar project for python](https://github.com/parabolala/bpylist2). The limitations as stated here apply to the current state of this project.
-   Ideas are also taken from the blog entry by https://digitalinvestigation.wordpress.com/2012/04/04/geek-post-nskeyedarchiver-files-what-are-they-and-how-can-i-use-them/
-   See also the documentation from Apple: https://developer.apple.com/documentation/foundation/nskeyedunarchiver
