import env from "./config/env";

import cors from "cors";

import express from "express";

import path from "path";

import { errorHandler } from "./middleware/errorHandler";

import userRoutes from "./routes/userRoutes";

import adminRoutes from "./routes/adminRoutes";

import categoryRoutes from "./routes/categoryRoutes";

import adminCategoryRoutes from "./routes/adminCategoryRoutes";

import adminProductRoutes from "./routes/adminProductRoutes";

import userProductRoutes from "./routes/userProductRoutes";

import userCartRoutes from "./routes/userCartRoutes";

import userWishlistRoutes from "./routes/userWishlistRoutes";

import swaggerUi from "swagger-ui-express";

import swaggerDocument from "./swagger-output.json";

import adminColorSchemeRoutes from "./routes/adminColorSchemeRoutes";

import adminSizeChartRoutes from "./routes/adminSizeChartRoutes";

import adminCouponRoutes from "./routes/adminCouponRoutes";

import userCouponRoutes from "./routes/userCouponRoutes";

import adminBlogRoutes from "./routes/adminBlogRoutes";

import userBlogRoutes from "./routes/userBlogRoutes";

import userAddressRoutes from "./routes/userAddressRoutes";

import adminAddressRoutes from "./routes/adminAddressRoutes";

import userOrderRoutes from "./routes/userOrderRoutes";

import adminOrderRoutes from "./routes/adminOrderRoutes";

import adminProductVariantRoutes from "./routes/adminProductVariantRoutes";

import userProductVariantRoutes from "./routes/userProductVariantRoutes";

import adminPincodeRoutes from "./routes/adminPincodeRoutes";

import adminPincodeGroupRoutes from "./routes/adminPincodeGroupRoutes";

import userPincodeRoutes from "./routes/userPincodeRoutes";

import userPincodeGroupRoutes from "./routes/userPincodeGroupRoutes";

import adminAboutPageContentRoutes from "./routes/adminAboutPageContentRoutes";

import userAboutPageContentRoutes from "./routes/userAboutPageContentRoutes";

import adminContactPageInformationRoutes from "./routes/adminContactPageInformationRoutes";

import userContactPageInformationRoutes from "./routes/userContactPageInformationRoutes";

import adminPolicyPageContentRoutes from "./routes/adminPolicyPageContentRoutes";

import userPolicyPageContentRoutes from "./routes/userPolicyPageContentRoutes";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use(express.json({ limit: "50mb" }));

const logger = (
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
) => {
  const url = req.url;
  const method = req.method;
  const time = new Date().toISOString();
  console.log(`[${time}] ${method} ${url}`);
  console.log(`Content-Type: ${req.headers["content-type"]}`);
  console.log(
    `Body keys: ${Object.keys(req.body || {}).length > 0
      ? Object.keys(req.body).join(", ")
      : "EMPTY"
    }`
  );
  next();
};

app.use(logger);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customSiteTitle: "Node Ecommerce API Docs",
    swaggerOptions: {
      docExpansion: "none",
      filter: true,
      displayRequestDuration: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
      defaultModelsExpandDepth: -1,
    },
  })
);

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/admin/categories", adminCategoryRoutes);

app.use("/api/v1/admin/color-schemes", adminColorSchemeRoutes);

app.use("/api/v1/admin/size-charts", adminSizeChartRoutes);

app.use("/api/v1/admin/coupons", adminCouponRoutes);

app.use("/api/v1/admin/blogs", adminBlogRoutes);

app.use("/api/v1/admin/products", adminProductRoutes);

app.use("/api/v1/admin/products", adminProductVariantRoutes);

app.use("/api/v1/products", userProductRoutes);

app.use("/api/v1/products", userProductVariantRoutes);

app.use("/api/v1/cart", userCartRoutes);

app.use("/api/v1/wishlist", userWishlistRoutes);

app.use("/api/v1/coupons", userCouponRoutes);

app.use("/api/v1/blogs", userBlogRoutes);

app.use("/api/v1/address", userAddressRoutes);

app.use("/api/v1/admin/address", adminAddressRoutes);

app.use("/api/v1/orders", userOrderRoutes);

app.use("/api/v1/admin/orders", adminOrderRoutes);

app.use("/api/v1/admin/pincodes", adminPincodeRoutes);

app.use("/api/v1/admin/pincode-groups", adminPincodeGroupRoutes);

app.use("/api/v1/pincodes", userPincodeRoutes);

app.use("/api/v1/pincode-groups", userPincodeGroupRoutes);

app.use("/api/v1/admin/about-page-content", adminAboutPageContentRoutes);

app.use("/api/v1/about-page-content", userAboutPageContentRoutes);

app.use("/api/v1/admin/contact-page-information", adminContactPageInformationRoutes);

app.use("/api/v1/contact-page-information", userContactPageInformationRoutes);

app.use("/api/v1/admin/policy-page-content", adminPolicyPageContentRoutes);

app.use("/api/v1/policy-page-content", userPolicyPageContentRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "___I'm yours to command.___" });
});

app.use((_, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
