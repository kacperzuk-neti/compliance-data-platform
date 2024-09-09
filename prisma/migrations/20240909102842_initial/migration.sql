-- CreateTable
CREATE TABLE "client_allocator_distribution_weekly" (
    "week" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "allocator" TEXT NOT NULL,
    "num_of_allocations" INTEGER NOT NULL,
    "sum_of_allocations" BIGINT NOT NULL,

    CONSTRAINT "client_allocator_distribution_weekly_pkey" PRIMARY KEY ("week","client","allocator")
);

-- CreateTable
CREATE TABLE "cid_sharing" (
    "client" TEXT NOT NULL,
    "other_client" TEXT NOT NULL,
    "total_deal_size" BIGINT NOT NULL,
    "unique_cid_count" INTEGER NOT NULL,

    CONSTRAINT "cid_sharing_pkey" PRIMARY KEY ("client","other_client")
);

-- CreateTable
CREATE TABLE "unified_verified_deal_hourly" (
    "hour" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "num_of_claims" INTEGER NOT NULL,
    "total_deal_size" BIGINT NOT NULL,

    CONSTRAINT "unified_verified_deal_hourly_pkey" PRIMARY KEY ("hour","client","provider")
);

-- CreateTable
CREATE TABLE "client_provider_distribution_weekly" (
    "week" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "total_deal_size" BIGINT NOT NULL,
    "unique_data_size" BIGINT NOT NULL,

    CONSTRAINT "client_provider_distribution_weekly_pkey" PRIMARY KEY ("week","client","provider")
);

-- CreateTable
CREATE TABLE "client_claims_hourly" (
    "hour" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "total_deal_size" BIGINT NOT NULL,

    CONSTRAINT "client_claims_hourly_pkey" PRIMARY KEY ("hour","client")
);

-- CreateTable
CREATE TABLE "provider_first_client" (
    "provider" TEXT NOT NULL,
    "first_client" TEXT NOT NULL,

    CONSTRAINT "provider_first_client_pkey" PRIMARY KEY ("provider")
);

-- CreateTable
CREATE TABLE "client_replica_distribution" (
    "client" TEXT NOT NULL,
    "num_of_replicas" INTEGER NOT NULL,
    "total_deal_size" BIGINT NOT NULL,
    "unique_data_size" BIGINT NOT NULL,

    CONSTRAINT "client_replica_distribution_pkey" PRIMARY KEY ("client","num_of_replicas")
);

-- CreateTable
CREATE TABLE "providers_weekly" (
    "week" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL,
    "num_of_clients" INTEGER NOT NULL,
    "biggest_client_total_deal_size" BIGINT NOT NULL,
    "total_deal_size" BIGINT NOT NULL,
    "avg_retrievability_success_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "providers_weekly_pkey" PRIMARY KEY ("week","provider")
);

-- CreateTable
CREATE TABLE "allocators_weekly" (
    "week" TIMESTAMP(3) NOT NULL,
    "allocator" TEXT NOT NULL,
    "num_of_clients" INTEGER NOT NULL,
    "biggest_client_sum_of_allocations" BIGINT NOT NULL,
    "total_sum_of_allocations" BIGINT NOT NULL,
    "avg_weighted_retrievability_success_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "allocators_weekly_pkey" PRIMARY KEY ("week","allocator")
);

-- CreateTable
CREATE TABLE "provider_retrievability_daily" (
    "date" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "successful" INTEGER NOT NULL,
    "success_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "provider_retrievability_daily_pkey" PRIMARY KEY ("date","provider")
);
