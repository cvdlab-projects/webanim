window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;

var dojox_json_ref = dojo.require ("dojox/json/ref");

function saveLoadGraphErrorHandler (error)
{
  var msg;

  switch (error.code) {
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.ABORT_ERR:
      msg = 'ABORT_ERR';
      break;
    case FileError.NOT_READABLE_ERR:
      msg = 'NOT_READABLE_ERR';
      break;
    case FileError.ENCODING_ERR:
      msg = 'ENCODING_ERR';
      break;
    case FileError.NO_MODIFICATION_ALLOWED_ERR:
      msg = 'NO_MODIFICATION_ALLOWED_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    case FileError.SYNTAX_ERR:
      msg = 'SYNTAX_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.TYPE_MISMATCH_ERR:
      msg = 'TYPE_MISMATCH_ERR';
      break;
    case FileError.PATH_EXISTS_ERR:
      msg = 'PATH_EXISTS_ERR';
      break;
  }
}

$("#save-graph-dialog-form").dialog ({
  autoOpen : false,
  modal : true,
  title : "Save Graph",
  buttons : {
    "Save" : function () {
      var name;

      name = $("#save-graph-name").val ();

      function saveGraphOpenFilesystem (filesystem)
      {
        console.log ("Initialized FileSystem API");
        console.log ("FileSystem root: " + filesystem.root.toURL ());

        function saveGraphOpenFile (file)
        {
          console.log ("Requested File: " + file.toURL ());

          function saveGraphWriteFile (writer)
          {
            var builder;

            console.log ("Requested writer");

            builder = new BlobBuilder ();
            builder.append (dojox_json_ref.toJson (storyboardController));
            writer.write (builder.getBlob ());
          }

          file.createWriter (saveGraphWriteFile, saveLoadGraphErrorHandler);
        }

        filesystem.root.getFile (name, {create : true}, saveGraphOpenFile, saveLoadGraphErrorHandler);
      }

      // 10 MB
      requestFileSystem (TEMPORARY, 10485760, saveGraphOpenFilesystem, saveLoadGraphErrorHandler);

      $(this).dialog ("close");
    },
    "Cancel" : function () {
      $(this).dialog ("close");
    }
  }
});

$("#load-graph-dialog-form").dialog ({
  autoOpen : false,
  modal : true,
  title : "Load Graph",
  buttons : {
    "Load" : function () {
      var name;

      name = $("#load-graph-name").val ();

      function loadGraphOpenFilesystem (filesystem)
      {
        console.log ("Initialized FileSystem API");
        console.log ("FileSystem root: " + filesystem.root.toURL ());

        function loadGraphOpenFileEntry (fileEntry)
        {
          console.log ("Requested FileEntry: " + fileEntry.toURL ());

          function loadGraphOpenFile (file)
          {
            var reader;

            console.log ("Requested File: " + file.name);

            reader = new FileReader ();
            reader.onload = function (event) {
              storyboardController = dojox_json_ref.fromJson (event.target.result);
            };
            reader.readAsText (file);
          }

          fileEntry.file (loadGraphOpenFile, saveLoadGraphErrorHandler);
        }

        filesystem.root.getFile (name, {}, loadGraphOpenFileEntry, saveLoadGraphErrorHandler);
      }

      // 10 MB
      requestFileSystem (TEMPORARY, 10485760, loadGraphOpenFilesystem, saveLoadGraphErrorHandler);

      $(this).dialog ("close");
    },
    "Cancel" : function () {
      $(this).dialog ("close");
    }
  }
});

$("#saveGraph").on ("click.webGraph", function () {
  $("#save-graph-dialog-form").dialog("open");
});

$("#loadGraph").on ("click.webGraph", function () {
  $("#load-graph-dialog-form").dialog("open");
});
