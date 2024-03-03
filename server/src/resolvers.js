const Product = require("./models/Product");
const User = require("./models/User");

const resolvers = {
  Query: {
    // Query to get all products in collection
    getAllProducts: async () => {
      try {
        const products = await Product.find();
        return products;
      } catch (error) {
        throw new Error("Error fetching all products");
      }
    },
    // Query product by ID
    getProductByID: async (_, { _id }) => {
      try {
        const product = await Product.findById(_id);
        if (!product) {
          throw new Error("Product not found");
        }
        return product;
      } catch (error) {
        throw new Error("Error fetching product");
      }
    },
    // Query to search product collection given query string
    searchProducts: async (_, { query }) => {
      const regex = new RegExp(query, "i");
      const products = await Product.find({
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
          { category: { $regex: regex } },
        ],
      });
      return products;
    },
    getUser: async (_, { userId }) => {
      try {
        let user = await User.findById(userId)
        if (!user) {
          throw new Error("User not found!");
        }
        // Save the updated user with the removed item
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    //Gets the cart and all product details given a user
    getUserCart: async (_, { userId }) => {
      try {
        let user = await User.findById(userId).populate("cart.product");
        if (!user) {
          throw new Error("User not found!");
        }
        // Save the updated user with the removed item
        return user.cart;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    // Mutation to update cart data
    updateCartItem: async (_, { userId, productId, quantity }) => {
      try {
        let user = await User.findById(userId).populate("cart.product");
        
        if (!user) {
          throw new Error("User not found!");
        }

        let product = await Product.findById(productId);
        if (!product) {
          throw new Error("Product not found!");
        }

        const existingCartItemIndex = user.cart.findIndex(
          (item) => String(item.product._id) === String(productId)
        );

        if (existingCartItemIndex !== -1) {
          // Update the quantity of the existing cart item
          user.cart[existingCartItemIndex].quantity = quantity;
        } else {
          // Add a new item to the cart
          user.cart.push({ product: productId, quantity: quantity });
        }

        user = await user.save();
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    // Mutation to remove an item from the cart
    removeCartItem: async (_, { userId, productId }) => {
      try {
        let user = await User.findById(userId).populate("cart.product");
        if (!user) {
          throw new Error("User not found!");
        }

        // Filter out the cart item to be removed
        user.cart = user.cart.filter(item => String(item.product._id) !== String(productId));

        // Save the updated user with the removed item
        user = await user.save();
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    // Mutation to add an item to the cart or increase its quantity by 1
    addToCart: async (_, { userId, productId }) => {
      try {
        let user = await User.findById(userId).populate("cart.product");
        
        if (!user) {
          throw new Error("User not found!");
        }

        let product = await Product.findById(productId);
        if (!product) {
          throw new Error("Product not found!");
        }

        const existingCartItemIndex = user.cart.findIndex(
          (item) => String(item.product._id) === String(productId)
        );

        if (existingCartItemIndex !== -1) {
          // Increment the quantity of the existing cart item by 1
          user.cart[existingCartItemIndex].quantity += 1;
        } else {
          // Add a new item to the cart with quantity 1
          user.cart.push({ product: productId, quantity: 1 });
        }

        user = await user.save();
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
