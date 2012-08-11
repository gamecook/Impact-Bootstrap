/*
 * Written by Aidan Coyne, in 2010, at Roundarch, under the direction of Jesse Freeman.
 * See README for info, and LICENSE for MIT License.
 */

function prop(name, value) { return name + "=\"" + value + "\""; }

//generate a sprite node.
function spriteString(x, y, w, h, name)
{
    return "<sprite" + " " + prop("name", name)
                    + " " + prop("x", x)
                    + " " + prop("y", y)
                    + " " + prop("w", w)
                    + " " + prop("h", h)
                    + " />";

}

function sheetString(sheet)
{
    return "<sheet" + " " + prop("name", sheet.name)
                    + " " + prop("src", sheet.longName + sheet.suffix)
                    + " " + prop("w", sheet.doc.width.value)
                    + " " + prop("h", sheet.doc.height.value)
                    + ">";

}

function closeSheet() { return "</sheet>";}

//This represents a sheet object - it has some locations and naming stuff, export options, and source layers
//cycle: createDoc, layout, saveAndExport
function Sheet(sourceLS)
{
    this.posFile = Sheet.posFile;
    this.baseLoc = Sheet.baseLocation;
    this.baseName = Sheet.baseName;
    this.opts = Sheet.opts;
    this.scale = Sheet.scale;
    this.doScale = Sheet.doScale;
    this.scaleAmount = Sheet.scaleAmount;
    this.useVariableSpaces = Sheet.useVariableSpaces;
    this.genXML = Sheet.genXML;
    this.saveByExport = Sheet.saveByExport;

    this.doc = null;
    this.sourceLS = sourceLS;
    this.name = sourceLS.name;
    this.longName = this.baseName + "-" + this.name;

    if (this.doScale)
        this.longName = this.longName + "-scale-" + this.scaleAmount;

    this.suffix = ".psd";
    if (this.saveByExport)
    {
        this.suffix = ".png";
        if (this.opts.format == SaveDocumentType.JPEG)
            this.suffix = ".jpg";
        else if (this.opts.format == SaveDocumentType.COMPUSERVEGIF)
            this.suffix = ".gif";
    }


    // saves doc as PSD in file, and exports images of aprropriate type
    this.saveOrExport = function()
    {
        var destFile = new File(this.baseLoc+ "/" + this.longName + this.suffix);
        if (this.saveByExport)
        {
            this.doc.exportDocument(destFile, ExportType.SAVEFORWEB, this.opts);
        }
        else
        {
            var saveOpt = new PhotoshopSaveOptions();
            this.doc.saveAs(destFile, saveOpt, false, Extension.LOWERCASE);
        }
    }

    //This function generates a new document,
    //copies each layer from the source layer set into the new document,
    //and figures out the width of the new document
    this.createDoc = function(sourceDoc)
    {
        var sourceLS = this.sourceLS;
        //create a new document that the layers can be copied to.
        var width = sourceLS.bounds[2] - sourceLS.bounds[0];
        var height = sourceLS.bounds[3] - sourceLS.bounds[1];
        
        this.doc = documents.add(width, height, sourceDoc.resolution, this.longName,
                                NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
      
        var newWidth = 0;
        //for every visible layer in the layer set, copy the layer over to the new document,
        //and (if in variable space mode) sum up the widths.
        for (var i=0; i < sourceLS.artLayers.length; i++)
        {
            var layer = sourceLS.artLayers[i];
            if (layer.visible)
            {
                //the requirement that the active doc be switched is irritating, I know.
                activeDocument = sourceDoc;
                layer.copy();
                activeDocument = this.doc;
                //we want to keep the original layer names. Yes, this does exactly that.
                this.doc.paste().name = layer.name;
                if (this.useVariableSpaces)
                    newWidth += (layer.bounds[2] - layer.bounds[0]) * this.scale;
            }
        }
        
        this.preLayout();

        if (!this.useVariableSpaces)
            newWidth = sourceLS.artLayers.length * this.defWidth;
        this.doc.resizeCanvas(newWidth, this.doc.height, AnchorPosition.TOPLEFT);
    }

    //does the scaling work.
    this.preLayout = function()
    {
        if (this.doScale)
        {
            var newWidth = this.doc.width * this.scale;
            var newHeight = this.doc.height * this.scale;
            this.doc.resizeImage(newWidth, newHeight, this.doc.resolution, ResampleMethod.NEARESTNEIGHBOR);
            this.doc.resizeCanvas(this.doc.width, this.doc.height, AnchorPosition.TOPLEFT);
        }
        this.defWidth = this.doc.width; //(sourceLS.bounds[2] - sourceLS.bounds[0]) * this.scale;
        this.defHeight = this.doc.height; //(sourceLS.bounds[3] - sourceLS.bounds[1]) * this.scale;
    }

    //lays out the layers of the spritesheet, logs information
    this.layout = function(indent)
    {
        var xpos = new UnitValue(0, "px"); //have to make this a unit value for initial subtraction to work.
        var sourceLS = this.sourceLS;

        //used for non-variable spacing mode:

        if (this.genXML)
            this.posFile.writeln(indent + sheetString(this));
        var indent2 = indent+indent;
        //this loop moves each layer 
        for (var i=0; i < this.doc.artLayers.length; i++) 
        {
            xpos = this.moveLayer(this.doc.artLayers[i], xpos, indent2);
        }
        if (this.genXML)
            this.posFile.writeln(indent + closeSheet());
    }


    //places the next layer in the new PSD, writes the position and dimensions to the file
    this.moveLayer = function(layer, newX, indent)
    {
        //place object all the way to the top left of the available space
        //remember that translate is relative to the current position of the layer.
        var negativeY = new UnitValue(-layer.bounds[1], "px");
        layer.translate(newX - layer.bounds[0], negativeY);
        
        //obtain the current dimensions and position of the layer.
        var x = layer.bounds[0];
        var width = layer.bounds[2] - x;
        var y = layer.bounds[1];
        var height = layer.bounds[3] - y;

        //If spacing is variable, then sprite is located properly.
        //Otherwise, center the sprite, and use the default sizes.
        if (!this.useVariableSpaces)
        {
            var xoffset = (this.defWidth - width) * 0.5;
            var yoffset = (this.defHeight - height) * 0.5;
            layer.translate(xoffset, yoffset);
            width = this.defWidth;
            height = this.defHeight;
        }

        if (this.genXML)
        {
            var xval = x.value;
            var yval = y.value;
            var wval = width.value;
            var hval = height.value;
            this.posFile.writeln(indent +
                    spriteString(xval, yval, wval, hval, layer.name));
        }

        //update the x position.
        return newX + width;
    }

    //close the document.
    this.close = function()
    {
        this.doc.close(SaveOptions.DONOTSAVECHANGES);
    }
}

//Brings up a dialog asking about how export should be done.
function getFormatOpts(sourceDoc)
{
    //The dialog is built using a resource string.
    var dia = new Window(
            "dialog \
            { \
                orientation: 'column', alignChildren: 'fill',\
                info: Panel \
                { orientation: 'column', alignChildren: 'fill', \
                    text: 'Format Options', \
                    format : Group \
                    { \
                        orientation: 'row', alignChildren:'fill', \
                        prompter : StaticText { text: 'What format to export in?'}, \
                        chooser : DropDownList { alignment: 'left' } \
                    },\
                    pngOpts: Group \
                    { \
                        orientation: 'row', \
                        typeCheck: Checkbox { text: 'Use PNG24 instead of PNG8.' }\
                    },\
                    jpgOpts: Group \
                    { \
                        orientation: 'column', alignChildren: 'left',\
                        msg: StaticText { text: 'How good should the quality be?' },\
                        quality: Group \
                        { \
                            orientation: 'row', alignChildren: 'left', \
                            slide: Slider { minValue: '0', maxValue: '100', value: '60'},\
                            current: EditText { text: '60', characters: '3'}\
                        },\
                    },\
                    gifOpts: Group \
                    { \
                        orientation: 'row' \
                    },\
                    psdOpts: Group \
                    {\
                        orientation: 'row'\
                    }\
                }, \
                genOpts: Panel \
                { \
                    orientation: 'column', alignChildren: 'fill',\
                    text: 'Generation options', \
                    xmlCheck: Checkbox { text : 'Generate XML positions file', value: 'true' }, \
                    variablePlacing: RadioButton { text: 'Place sprites using varying spacing', value: 'true'},\
                    constantPlacing: RadioButton { text: 'Place sprites with constant sized areas'}\
                },\
                scaleOpts: Panel \
                { \
                    orientation: 'row', alignChildren: 'fill', \
                    text: 'Scale Image?',\
                    scale: Slider {minValue: '0', maxValue: '100', value: '100'}, \
                    scCurrent: EditText {text: '100', characters: '3'} \
                },\
                locPick: Panel \
                { \
                    orientation: 'row', alignChildren: 'center', \
                    text: 'Location',\
                    currentLoc: StaticText {characters: '40', properties:{truncate:'middle'}},\
                    bringDialog: Button {text: 'Browse'}\
                },\
                buttonsCont: Group \
                { \
                    orientation: 'column', alignChildren: 'center',\
                    buttons: Group \
                    { \
                        orientation: 'row', alignChildren:'center',\
                        okBtn: Button { text:'OK', properties:{name:'ok'}},  \
                        cancelBtn: Button { text:'Cancel', properties:{name:'cancel'}} \
                    } \
                }\
             } " );
    // this allows only option groups for the chosen format to be shown
    dia.info.format.chooser.onChange = function ()
    {
        if (this.selection != null) 
        {
            for (var g = 0; g < this.items.length; g++)
                this.items[g].group.visible = false; //hide all other groups
            this.selection.group.visible = true;//show this group
        }
    }

    //for the slider
    dia.info.jpgOpts.quality.slide.onChanging = function()
    {
        dia.info.jpgOpts.quality.current.text = dia.info.jpgOpts.quality.slide.value;
    }
    dia.info.jpgOpts.quality.slide.onChange = dia.info.jpgOpts.quality.slide.onChanging;

    dia.info.jpgOpts.quality.current.onChange = function()
    {
        var val = dia.info.jpgOpts.quality.current.text;
        if (isNaN(val))
        {
            val = 60;
            dia.info.jpgOpts.quality.current.text = val;
        }
        dia.info.jpgOpts.quality.slide.value = val;
    }

    //for the scale slider
    dia.scaleOpts.scale.onChanging = function()
    {
        dia.scaleOpts.scCurrent.text = dia.scaleOpts.scale.value;
    }

    dia.scaleOpts.scale.onChange = dia.scaleOpts.scale.onChanging;

    dia.scaleOpts.scCurrent.onChange = function()
    {
        var val = dia.scaleOpts.scCurrent.text;
        if (isNaN(val))
        {
            val = 100;
            dia.scaleOpts.scCurrent.text = val;
        }
        dia.scaleOpts.scale.value = val;
    }

    //formats that can be exported to, and their options
    var item = dia.info.format.chooser.add("item", "PNG");
    item.group = dia.info.pngOpts;
    item = dia.info.format.chooser.add("item", "JPEG");
    item.group = dia.info.jpgOpts;
    item = dia.info.format.chooser.add("item", "GIF");
    item.group = dia.info.gifOpts;
    item = dia.info.format.chooser.add("item", "PSD");
    item.group = dia.info.psdOpts;
    dia.info.format.chooser.selection = dia.info.format.chooser.items[0];

    //directory chooser.
    var base = sourceDoc.path;
    Sheet.baseLocation = base.fsName;
    dia.locPick.currentLoc.text = Sheet.baseLocation;
    dia.locPick.bringDialog.onClick = function ()
    {
        var baseTemp = base.selectDlg();
        if (baseTemp == null)
            return ;
        base = baseTemp;
        Sheet.baseLocation = base.fsName;
        dia.locPick.currentLoc.text = Sheet.baseLocation.toString();
        dia.locPick.layout.resize();
    }
    dia.center();
    result = dia.show();
    if (result == 1)
    {
        //generate the options object using the results from the dialog.
        var exportOpts = new ExportOptionsSaveForWeb();
        Sheet.saveByExport = true;
        switch (dia.info.format.chooser.selection.index)
        {
            case 0: //PNG
                exportOpts.format = SaveDocumentType.PNG;
                exportOpts.PNG8 = !dia.info.pngOpts.typeCheck.value;
                break;
            case 1: //JPEG
                exportOpts.format = SaveDocumentType.JPEG;
                exportOpts.quality = dia.info.jpgOpts.quality.slide.value;
                break;
            case 2: //GIF
                exportOpts.format = SaveDocumentType.COMPUSERVEGIF;
                break;
            case 3: //PSD
                Sheet.saveByExport = false;
                break;
        }
        Sheet.opts = exportOpts;
        Sheet.scale = dia.scaleOpts.scale.value / 100.0;
        Sheet.scaleAmount = dia.scaleOpts.scale.value;
        if (dia.scaleOpts.scale.value < 100)
        {
            Sheet.doScale = true;
        }
        Sheet.genXML = dia.genOpts.xmlCheck.value;
        Sheet.useVariableSpaces = dia.genOpts.variablePlacing.value;
        return true;
    }
    else
        return false;
}


//New version! this one generates a spritesheet for each layer set (folder) of the document.
//It asks for the location to store the generated spritesheets, and has a single log
//file for positions and files of spritesheets from each folder.
function main()
{
	app.preferences.rulerUnits = Units.PIXELS;
    var sourceDoc = activeDocument;

    //get options for exporting each generated sheet to PNG
    gotOpts = getFormatOpts(sourceDoc);
    if (!gotOpts)
        return ;

    var count = sourceDoc.layerSets.length;
    
    //check that the document has folders.
    if (count == 0)
    {
        Window.alert("This script works on layers that are in folders, but this document does not have any folders. Please add at least one folder of layers before running this script.",
                "No folders found");
        return ;
    }

    //find out where to store everything.
    Sheet.baseName = sourceDoc.name.substring(0, sourceDoc.name.lastIndexOf("."));

    //text file stores positions of sprites in the sheets.
    if (Sheet.genXML)
    {
        var suffix = "-positions.xml";
        if (Sheet.doScale)
            suffix = "-positions-scale-" +Sheet.scaleAmount + ".xml";
        Sheet.posFile = new File(Sheet.baseLocation + "/" + Sheet.baseName + suffix, "TEXT");
        Sheet.posFile.encoding = "UTF-8";
        with (Sheet.posFile)
        {
            open("w");
            writeln("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
            writeln("<positions " + prop("name", Sheet.baseName) + " >");
        }
    }

    var sheet;
    var indent = "    ";

    displayDialogs = DialogModes.ERROR;
    //loop over each folder, generating sheets.
    for (var i=0; i < count; i++) 
    {
        if (!sourceDoc.layerSets[i].visible)
            continue;
        with (new Sheet(sourceDoc.layerSets[i]))
        {
            createDoc(sourceDoc);
            //preLayout();
            layout(indent);
            saveOrExport();
            close();
        }
    }
    if (Sheet.genXML)
    {
        with (Sheet.posFile)
        {
            writeln("</positions>");
            close();
        }
    }
    displayDialogs = DialogModes.ALL;

}
main()
