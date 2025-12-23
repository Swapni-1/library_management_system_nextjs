generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product{
    id String @id @default(cuid())
    title String
    price Float
    description String
    category String
    image String
    rating Json
}