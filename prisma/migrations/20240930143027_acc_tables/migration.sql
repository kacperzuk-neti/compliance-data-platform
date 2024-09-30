-- CreateTable
CREATE TABLE "client_allocator_distribution_weekly_acc" (
    "week" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "allocator" TEXT NOT NULL,
    "num_of_allocations" INTEGER NOT NULL,
    "sum_of_allocations" BIGINT NOT NULL,

    CONSTRAINT "client_allocator_distribution_weekly_acc_pkey" PRIMARY KEY ("week","client","allocator")
);

-- CreateTable
CREATE TABLE "client_provider_distribution_weekly_acc" (
    "week" TIMESTAMP(3) NOT NULL,
    "client" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "total_deal_size" BIGINT NOT NULL,
    "unique_data_size" BIGINT NOT NULL,

    CONSTRAINT "client_provider_distribution_weekly_acc_pkey" PRIMARY KEY ("week","client","provider")
);

-- CreateTable
CREATE TABLE "providers_weekly_acc" (
    "week" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL,
    "num_of_clients" INTEGER NOT NULL,
    "biggest_client_total_deal_size" BIGINT NOT NULL,
    "total_deal_size" BIGINT NOT NULL,
    "avg_retrievability_success_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "providers_weekly_acc_pkey" PRIMARY KEY ("week","provider")
);

-- CreateTable
CREATE TABLE "allocators_weekly_acc" (
    "week" TIMESTAMP(3) NOT NULL,
    "allocator" TEXT NOT NULL,
    "num_of_clients" INTEGER NOT NULL,
    "biggest_client_sum_of_allocations" BIGINT NOT NULL,
    "total_sum_of_allocations" BIGINT NOT NULL,
    "avg_weighted_retrievability_success_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "allocators_weekly_acc_pkey" PRIMARY KEY ("week","allocator")
);
