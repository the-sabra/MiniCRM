"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  Card,
  Skeleton,
  Button,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Image from "next/image";
import { propertyApi } from "@/lib/api";
import type { PropertyStatistics } from "@/types/property.types";
import { StatusDonutChart } from "@/components/properties/StatusDonutChart";
import { LocationAreaChart } from "@/components/properties/LocationAreaChart";

export default function PropertiesStatisticsPage() {
  const [stats, setStats] = useState<PropertyStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await propertyApi.getStatistics();
        if (mounted) setStats(res.data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

const formattedPrices = useMemo(() => {
    if (!stats) return { egp: "-", sar: "-" };

    const getCurrencySymbolInfo = (currency: string) => {
        try {
            const parts = new Intl.NumberFormat(undefined, {
                style: "currency",
                currency,
                currencyDisplay: "narrowSymbol",
                maximumFractionDigits: 0,
            }).formatToParts(1);
            const currencyPart = parts.find((p) => p.type === "currency")?.value ?? currency;
            const integerIndex = parts.findIndex((p) => p.type === "integer");
            const currencyIndex = parts.findIndex((p) => p.type === "currency");
            const before = currencyIndex >= 0 && (integerIndex < 0 || currencyIndex < integerIndex);
            return { symbol: currencyPart, before };
        } catch {
            return { symbol: currency, before: true };
        }
    };

    const formatWithSuffix = (amount: number, currency: string) => {
        const value = amount / 100;
        const abs = Math.abs(value);
        let divisor = 1;
        let suffix = "";

        if (abs >= 1_000_000_000) {
            divisor = 1_000_000_000;
            suffix = "B";
        } else if (abs >= 1_000_000) {
            divisor = 1_000_000;
            suffix = "M";
        } else if (abs >= 1_000) {
            divisor = 1_000;
            suffix = "K";
        }

        try {
            if (!suffix) {
                // No suffix: use full currency formatting
                return new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency,
                    currencyDisplay: "narrowSymbol",
                    maximumFractionDigits: 2,
                }).format(value);
            }

            const scaled = value / divisor;
            const numeric = new Intl.NumberFormat(undefined, {
                maximumFractionDigits: 2,
            }).format(scaled);

            const { symbol, before } = getCurrencySymbolInfo(currency);
            // For SAR, return only the numeric value (icon will be added separately)
            if (currency === "SAR") {
                return `${numeric}${suffix}`;
            }
            if (before) return `${symbol} ${numeric}${suffix}`;
            return `${numeric}${suffix} ${symbol}`;
        } catch {
            const fallbackValue = (value).toFixed(2);
            return `${currency} ${fallbackValue}${suffix}`;
        }
    };

    return {
        egp: formatWithSuffix(stats.averagePrice.EGP || 0, "EGP"),
        sar: formatWithSuffix(stats.averagePrice.SAR || 0, "SAR"),
    };
}, [stats]);

  return (
    <Container maxW="container.xl" py={8}>
      <Stack gap={6}>
        <Box>
          <Flex justify="space-between" align={{ base: 'stretch', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={3}>
            <Box>
              <Heading size="2xl" mb={2}>
                Property Statistics
              </Heading>
              <Box color="gray.600">Overview of your properties performance</Box>
            </Box>
            <NextLink href="/properties">
              <Button variant="outline" colorPalette="blue">
                ← Back to Properties
              </Button>
            </NextLink>
          </Flex>
        </Box>

        {loading ? (
          <Stack gap={8}>
            {/* KPI Summary Skeleton */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
              {[1, 2, 3, 4].map((i) => (
                <GridItem key={i}>
                  <Card.Root p={4}>
                    <Skeleton height="100px" />
                  </Card.Root>
                </GridItem>
              ))}
            </Grid>

            {/* Charts Skeleton */}
            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
              {[1, 2].map((i) => (
                <GridItem key={i}>
                  <Card.Root p={4}>
                    <Skeleton height="300px" />
                  </Card.Root>
                </GridItem>
              ))}
            </Grid>
          </Stack>
        ) : stats ? (
          <Stack gap={8}>
            {/* KPI Summary */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
              <GridItem>
                <Card.Root p={4}>
                  <Stat.Root>
                    <StatLabel>Total Properties</StatLabel>
                    <Stat.ValueUnit fontSize="lg">{stats.totalProperties} Unites</Stat.ValueUnit>
                    <StatHelpText>Total count in the system</StatHelpText>
                  </Stat.Root>
                </Card.Root>
              </GridItem>
              <GridItem>
                <Card.Root p={4}>
                  <Stat.Root>
                    <StatLabel>Average Price</StatLabel>
                    <Stack gap={3}>
                      <Stat.ValueUnit fontSize="lg">{formattedPrices.egp}</Stat.ValueUnit>
                      <Flex align="center" gap={2}>
                        <Box boxSize="15px" filter="brightness(2) invert(1)">
                          <Image 
                            src="/sar-symbol.svg" 
                            alt="SAR" 
                            width={20}
                            height={20}
                            style={{ display: 'inline-block', paddingBottom: '35px' }}
                          />
                        </Box>
                        <Stat.ValueUnit fontSize="lg">{formattedPrices.sar}</Stat.ValueUnit>
                      </Flex>
                    </Stack>
                    <StatHelpText>Across all properties</StatHelpText>
                  </Stat.Root>
                </Card.Root>
              </GridItem>
              <GridItem>
                <Card.Root p={4}>
                  <Stat.Root>
                    <StatLabel>Available</StatLabel>
                    <Stat.ValueUnit>{stats.statusCount.available}</Stat.ValueUnit>
                    <StatHelpText>Currently on the market</StatHelpText>
                  </Stat.Root>
                </Card.Root>
              </GridItem>
              <GridItem>
                <Card.Root p={4}>
                  <Stat.Root>
                    <StatLabel>Sold</StatLabel>
                    <Stat.ValueUnit>{stats.statusCount.sold}</Stat.ValueUnit>
                    <StatHelpText>Total sold to date</StatHelpText>
                  </Stat.Root>
                </Card.Root>
              </GridItem>
            </Grid>

            {/* Charts */}
            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
              <GridItem>
                <Card.Root p={4}>
                  <Heading size="md" mb={4}>
                    Status Distribution
                  </Heading>
                  <StatusDonutChart
                    available={stats.statusCount.available}
                    sold={stats.statusCount.sold}
                  />
                </Card.Root>
              </GridItem>
              <GridItem>
                <Card.Root p={4}>
                 <Heading size="md" mb={4}>
                    Location Averages
                  </Heading>
                    <LocationAreaChart data={stats.locationStats} />
                </Card.Root>
              </GridItem>
            </Grid>
          </Stack>
        ) : (
          <Box color="gray.600">No statistics available.</Box>
        )}
      </Stack>
    </Container>
  );
}
