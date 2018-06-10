Import Export modal Library
____

A very simple import export library.

Example:
```html
<button id="export_save">Export save</button>
<button id="download_save">Download save</button>
<button id="import_save">Import save</button>

<dialog id="Import_Export_dialog">
	<div>
		<form method="dialog">
			<menu>
				<button id="Import_Export_close_button" type="reset">Cancel</button>
				<button id="import_button" type="submit">Import</button>
			</menu>
			<section>
				<textarea id="txtImportExport" rows="10" cols="75"></textarea>
			</section>
		</form>
	</div>
</dialog>

<script>

import_export.saves = function saves(){return string_save};
import_export.loads = function loads(string_save){};
// name of save file for download_save
import_export.save_file = 'save.base64';

</script>
```
