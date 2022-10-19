//Un objeto con métodos que permiten interactuar con los datos

import axios from "axios";
import Papa from "papaparse";

import {Product} from "./types";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vRCVzEG9z5Sttv4ulvSu_NLQXF43hXhlWYS_QIA8ecrU_TIR64vzGngN4RNGmFXfGroR9zQ_Av395B_/pub?output=csv`,
        {
          responseType: "blob",
        },
      )
      .then(
        (response) =>
          new Promise<Product[]>((resolve, reject) => {
            Papa.parse(response.data, {
              header: true,
              complete: (results) => {
                const products = results.data as Product[];

                return resolve(
                  products.map((product) => ({
                    ...product,
                    price: Number(product.price),
                  })),
                );
              },
              error: (error) => reject(error.message),
            });
          }),
      );
  },
};
