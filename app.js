const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(
    path.resolve(__dirname, "docx/input/input.docx"),
    "binary"
);

const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
});

doc.render({
    first_name: "Rogerio",
    last_name: "Alencar Filho",
    phone: "+55 (81) 12342-2344",
    description: "lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem ",
});

const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
});

fs.writeFileSync(path.resolve(__dirname, "docx/output/output.docx"), buf);