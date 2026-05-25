const Accounts = require("../models/accounts.models");

const DOC_TYPES = [
  { code: "CC", name: "Cédula de Ciudadanía" },
  { code: "CE", name: "Cédula de Extranjería" },
  { code: "PA", name: "Pasaporte" },
  { code: "PPT", name: "Permiso de Permanencia Temporal" },
];

const VIA_TYPES = [
  { code: "CL", name: "Calle" },
  { code: "KR", name: "Carrera" },
  { code: "DG", name: "Diagonal" },
  { code: "TV", name: "Transversal" },
  { code: "AV", name: "Avenida" },
  { code: "AC", name: "Avenida Calle" },
  { code: "AK", name: "Avenida Carrera" },
];

const doc_types_seeder = async () => {
  try {
    const existing = await Accounts.DocType.count();
    if (existing === 0) {
      await Accounts.DocType.bulkCreate(DOC_TYPES, { updateOnDuplicate: ["name"] });
      console.log("\x1b[34mDOC TYPES TABLE STATUS:\x1b[0m", "\x1b[32mSYNC\x1b[0m");
    } else {
      console.log("\x1b[34mDOC TYPES TABLE STATUS:\x1b[0m", "\x1b[33mEXISTING RECORDS FOUND, NO NEW RECORDS ADDED\x1b[0m");
    }
  } catch (err) {
    console.error(err);
  }
};

const via_types_seeder = async () => {
  try {
    const existing = await Accounts.ViaType.count();
    if (existing === 0) {
      await Accounts.ViaType.bulkCreate(VIA_TYPES, { updateOnDuplicate: ["name"] });
      console.log("\x1b[34mVIA TYPES TABLE STATUS:\x1b[0m", "\x1b[32mSYNC\x1b[0m");
    } else {
      console.log("\x1b[34mVIA TYPES TABLE STATUS:\x1b[0m", "\x1b[33mEXISTING RECORDS FOUND, NO NEW RECORDS ADDED\x1b[0m");
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { doc_types_seeder, via_types_seeder, DOC_TYPES, VIA_TYPES };
