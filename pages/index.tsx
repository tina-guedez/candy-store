import React, {useMemo, useState} from "react";
import {GetStaticProps} from "next";
import {Button, Grid, Link, Stack, Text} from "@chakra-ui/react";

import {Product} from "../product/types";
import api from "../product/api";

interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

const IndexRoute: React.FC<Props> = ({products}) => {
  const [cart, setCart] = useState<Product[]>([]);
  const text = useMemo(() => {
    return cart
      .reduce(
        (message, product) =>
          message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n`),
        ``,
      )
      .concat(
        `\nTotal: ${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`,
      );
  }, [cart]);

  return (
    <Stack>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack key={product.id} backgroundColor="gray.100">
            <Text>{product.title}</Text>
            <Text>{parseCurrency(product.price)}</Text>
            <Button colorScheme="blue" onClick={() => setCart((cart) => cart.concat(product))}>
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length) && (
        <Button
          isExternal
          as={Link}
          colorScheme="whatsapp"
          href={`https://wa.me/5491141414141?text=${encodeURIComponent(text)}`}
        >
          Ver carrito ({cart.length} productos)
        </Button>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    props: {
      products,
    },
  };
};

export default IndexRoute;
