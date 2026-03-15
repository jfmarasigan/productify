import { db } from "./index";
import { eq } from "drizzle-orm";
import { users, comments, products, type User, type Product, type Comment, NewUser, NewProduct, NewComment } from "./schema";

export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) })
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
};

export const upsertUser = async (data: NewUser) => {
  const existingUser = await getUserById(data.id);
  if (existingUser) {
    return updateUser(data.id, data);
  } else {
    return createUser(data);
  }
};

export const createProduct = async (newProduct: NewProduct) => {
  const [product] = await db.insert(products).values(newProduct).returning();
  return product;
};

export const getAllProducts = async () => {
  await db.query.products.findMany({
    // see note on relationin src/db/schema.ts; you need the with property to properly retrieve the relation
    with: { user: true },
    // (table, { orderDirection }) => orderDirection(table column in schema file)
    // square brackets are required because drizzle's orderby expects an array, even for a single column
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const getProductById = async (id: string) => {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)]
      }
    }
  });
};

export const getProductsByUserId = async (userId: string) => {
  return await db.query.products.findMany({
    where: eq(products.createdBy, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)]
  })
};

export const updateProduct = async (id: string, newProduct: Partial<NewProduct>) => {
  const [product] = await db.update(products).set(newProduct).where(eq(products.id, id)).returning();
  return product;
};

export const deleteProduct = async (id: string) => {
  const [product] = await db.delete(products).where(eq(products.id, id)).returning();
  return product;
};

export const createComment = async (newComment: NewComment) => {
  const [comment] = await db.insert(comments).values(newComment).returning();
  return comment;
};

export const deleteComment = async (id: string) => {
  const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  return await db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true }
  });
};

