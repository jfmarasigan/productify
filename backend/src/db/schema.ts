import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// pgTable("table name", { fields })
export const users = pgTable("users", {
  id: text("id").primaryKey(), // clerk id
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow()
});

export const products = pgTable("products", {
  id: uuid().defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  createdBy: text("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow()
});

export const comments = pgTable("comments", {
  id: uuid().defaultRandom().primaryKey(),
  content: text("content").notNull(),
  commentBy: text("comment_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow()
});

// relations define how tables connect to each other in the drizzle orm query.
// this enables drizzle quesy API to automatically join related data when using `with: { relationName: true }`

// user's relations: a user can have many products and many comments
// using many() means one user can have multiple related records
export const userRelations = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments)
}));

// product's relations: a product belongs to one user and can have many comments
// `one()` means a single related record
export const productRelations = relations(products, ({ many, one }) => ({
  // `fields` = the foreign key column in THIS table (products.createdBy)
  // `references` = the primary key column in the RELATED TABLE (users.id)
  user: one(users, { fields: [products.createdBy], references: [users.id] }),
  comments: many(comments)
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.commentBy], references: [users.id] }),
  products: one(products, { fields: [comments.productId], references: [products.id] })
}));

// type inference 
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;