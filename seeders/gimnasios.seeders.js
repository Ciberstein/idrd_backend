const { Gimnasio } = require("../models/gimnasios.models");

const GIMNASIOS = [
  {
    idrd_id: 15227,
    address: "CALLE 17A SUR N 2A 50 E",
    code: "04-127",
    park: "SAN CRISTOBAL",
    locality: "SAN CRISTOBAL",
    upz: "SOSIEGO",
    description: "CENTRO FELICIDAD CEFE",
  },
  {
    idrd_id: 17167,
    address: "CALLE 48 C SUR N 22D 81",
    code: "06-063",
    park: "EL TUNAL",
    locality: "TUNJUELITO",
    upz: "VENECIA",
    description: "CEFE TUNAL.",
  },
  {
    idrd_id: 17598,
    address: "DIAGONAL 147 N 141A 42",
    code: "11-368",
    park: "FONTANAR DEL RIO",
    locality: "SUBA",
    upz: "TIBABUYES",
    description: "CEFE - CENTRO RECRETIVO DEPORTI Y CULTURAL",
  },
  {
    idrd_id: 18178,
    address: "CERROS DE SUBA CUCHILLA",
    code: "11-204",
    park: "PARQUE DEL INDIO O DE LAS COMETAS",
    locality: "SUBA",
    upz: "NIZA",
    description: "CEFE - CENTRO RECREATIVO DEPORTIVO Y CULTURAL",
  },
];

const gimnasios_seeder = async () => {
  try {
    const existing = await Gimnasio.count();

    if (existing === 0) {
      await Gimnasio.bulkCreate(GIMNASIOS, {
        updateOnDuplicate: ["address", "code", "park", "locality", "upz", "description"],
      });
      console.log("\x1b[34mGIMNASIOS TABLE STATUS:\x1b[0m", "\x1b[32mSYNC\x1b[0m");
    } else {
      console.log(
        "\x1b[34mGIMNASIOS TABLE STATUS:\x1b[0m",
        "\x1b[33mEXISTING RECORDS FOUND, NO NEW RECORDS ADDED\x1b[0m"
      );
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { gimnasios_seeder, GIMNASIOS };
