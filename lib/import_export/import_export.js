(function() {
'use strict';

var import_export = {};
window.import_export = import_export;

var el;

el = document.getElementById('download_save');
if (el){
    el.onclick = function() {
        var save_data = import_export.saves();
        var saveAsBlob = new Blob([ save_data ], { type: 'text/plain' });
        var downloadLink = document.createElement("a");

        downloadLink.download = import_export.save_file || "save.base64";
        downloadLink.textContent = "Download File";
        downloadLink.href = URL.createObjectURL(saveAsBlob);
        downloadLink.onclick = (event) => {
            // clean up blob after the browser get it
            setTimeout(URL.revokeObjectURL, 100, event.target.href);
            document.body.removeChild(event.target)
        };
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);

        downloadLink.click();
    };
}

el = document.getElementById('export_save');
// if export button exists, assume the form exists
if (el){
    el.onclick = function() {
        var save_data = import_export.saves();
        document.getElementById('import_button').style.display = "none";
        document.getElementById("txtImportExport").value = save_data;
        document.getElementById("txtImportExport").select();
        document.getElementById("Import_Export_dialog").showModal();
    };
}

// if import button exists, assume the form exists
el = document.getElementById('import_save');
if (el){
    el.onclick = function() {
        document.getElementById('import_button').style.display = null;
        document.getElementById("txtImportExport").value = "";
        document.getElementById("Import_Export_dialog").showModal();
    };
}

el = document.getElementById('import_button');
if (el){
    el.onclick = function() {
        import_export.loads(document.getElementById("txtImportExport").value);
        document.getElementById("txtImportExport").value = "";
    };
}

el = document.getElementById('Import_Export_close_button');
if (el){
    el.onclick = function() {
        document.getElementById('Import_Export_dialog').close();
    }
}

})()
