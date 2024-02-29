// ProductDetails.js

import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Box, Image, Heading, Text, Button } from '@chakra-ui/react';
<<<<<<< HEAD
import { useCart } from '../contexts/CartContext';
=======
import { useCart } from '../contexts/CartContext'; // Import useCart hook
>>>>>>> 988bbe053d2a029dcf555b635dabce6531da8ffd

const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($_id: ID!) {
    getProductByID(_id: $_id) {
      _id
      name
      description
      price
      category
      imageURL
    }
  }
`;

const ProductDetails = () => {
  const { productId } = useParams();
<<<<<<< HEAD
  const { addToCart } = useCart();
=======
  const { addToCart } = useCart(); // Get addToCart function from useCart hook
>>>>>>> 988bbe053d2a029dcf555b635dabce6531da8ffd

  const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { _id: productId },
  });

  const handleAddToCart = () => {
    // Add the product to the cart
    addToCart(productId);
    alert('Product added to cart!');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { getProductByID: product } = data;

  return (
    <Box maxW="800px" mx="auto" p="4">
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="4">
        <Image src={product.imageURL} alt={product.name} mb="4" />
        <Heading as="h2" size="lg" mb="2">{product.name}</Heading>
        <Text fontSize="md" mb="2">{product.description}</Text>
        <Text fontSize="lg" fontWeight="bold" mb="2">Price: ${product.price}</Text>
        <Text fontSize="lg" fontStyle="italic">Category: {product.category}</Text>
        <Button onClick={handleAddToCart} colorScheme="teal" mt="4">Add to Cart</Button> {/* Add button to add product to cart */}
      </Box>
    </Box>
  );
};

export default ProductDetails;
