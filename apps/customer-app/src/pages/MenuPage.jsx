import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { ErrorState } from "../components/states/ErrorState.jsx";
import { LoadingState } from "../components/states/LoadingState.jsx";
import { APP_ROUTES } from "../constants/routes.js";
import { StickyCartBar } from "../features/cart/components/StickyCartBar.jsx";
import { CategoryTabs } from "../features/menu/components/CategoryTabs.jsx";
import { MenuItemCard } from "../features/menu/components/MenuItemCard.jsx";
import { MenuItemDialog } from "../features/menu/components/MenuItemDialog.jsx";
import { MenuSearchBar } from "../features/menu/components/MenuSearchBar.jsx";
import { RestaurantHero } from "../features/restaurant/components/RestaurantHero.jsx";
import { useRestaurantExperience } from "../hooks/useRestaurantExperience.js";
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";
import { useOrdering } from "../store/OrderingContext.jsx";
import { createCartLine } from "../utils/cart.js";
import { formatCurrency } from "../utils/formatters.js";
import { LiveOrderBanner } from "../features/orders/components/LiveOrderBanner.jsx";

export function MenuPage() {
  const { restaurantId, tableId } = useParams();
  const [searchParams] = useSearchParams();
  const seatId = searchParams.get("seat") || "";
  const navigate = useNavigate();
  const { loading, error, data } = useRestaurantExperience(restaurantId, tableId, seatId);
  const {
    itemCount,
    summary,
    hydrateRestaurant,
    addToCart,
    restaurant,
    table,
    lastOrder
  } = useOrdering();

  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    if (!data) return;
    hydrateRestaurant({
      session: data.session,
      restaurant: data.restaurant,
      table: data.table,
      pricing: data.pricing,
      paymentMethods: data.paymentMethods
    });
  }, [data, hydrateRestaurant]);

  const sections = useMemo(() => {
    if (!data) return [];
    const query = deferredSearch.trim().toLowerCase();

    return data.categories
      .map((category) => ({
        ...category,
        items: data.menuItems.filter((item) => {
          if (item.categoryId !== category.id) return false;
          if (!query) return true;
          return [item.name, item.description, ...(item.ingredients || [])].join(" ").toLowerCase().includes(query);
        })
      }))
      .filter((category) => {
        if (activeCategoryId && category.id !== activeCategoryId) return false;
        return category.items.length > 0;
      });
  }, [activeCategoryId, data, deferredSearch]);

  if (loading) {
    return (
      <CustomerLayout>
        <LoadingState />
      </CustomerLayout>
    );
  }

  if (error || !data) {
    return (
      <CustomerLayout>
        <ErrorState
          title="This table link needs a refresh"
          description={error || "We could not load the dining experience for this QR route."}
          actionLabel="Try again"
          onAction={() => window.location.reload()}
        />
      </CustomerLayout>
    );
  }

  const currency = data.pricing.currency;
  const featuredCategories = data.categories.filter((category) => category.featured);
  const activeSection = activeCategoryId ? sections.find((section) => section.id === activeCategoryId) : null;

  function handleQuickAdd(item) {
    addToCart(
      createCartLine({
        item,
        quantity: 1,
        selectedCustomizations: [],
        specialInstructions: ""
      })
    );
  }

  function handleDialogAdd(payload) {
    addToCart(
      createCartLine({
        item: payload.item,
        quantity: payload.quantity,
        selectedCustomizations: payload.selectedCustomizations,
        specialInstructions: payload.specialInstructions
      })
    );
    setSelectedItem(null);
  }

  return (
    <CustomerLayout>
      <Stack spacing={2.25}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2.25}
          alignItems="flex-start"
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <RestaurantHero restaurant={data.restaurant} tableLabel={data.table.label} />
          </Box>

          <Stack spacing={2.25} sx={{ width: { xs: "100%", lg: 360 }, position: { lg: "sticky" }, top: { lg: 16 } }}>
            <Card>
              <CardContent sx={{ p: 2.25 }}>
                <Stack spacing={1.5}>
                  <Stack spacing={0.35}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Table session
                    </Typography>
                    <Typography variant="h6">Quick, clean ordering</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Browse dishes, open details, and add everything without losing the table context.
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack spacing={1.2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Live basket
                    </Typography>
                    <Typography variant="body1" fontWeight={850}>
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(summary.total, currency)} total
                    </Typography>
                    <Button
                      variant="contained"
                      endIcon={<ShoppingBagRoundedIcon />}
                      onClick={() => navigate(APP_ROUTES.cart(restaurantId, tableId, seatId))}
                      disabled={!itemCount}
                    >
                      Open cart
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {lastOrder ? (
              <LiveOrderBanner
                order={lastOrder}
                restaurantId={restaurantId}
                tableId={tableId}
                seatId={seatId}
                dense
                onOpenTracking={() =>
                  navigate(APP_ROUTES.tracking(restaurantId, tableId, lastOrder.id, seatId))
                }
              />
            ) : null}

          </Stack>
        </Stack>

        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="stretch">
                <Box sx={{ flex: 1 }}>
                  <MenuSearchBar value={search} onChange={setSearch} />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<BoltRoundedIcon />}
                  onClick={() => {
                    setSearch("");
                    setActiveCategoryId("");
                  }}
                  sx={{ minWidth: { md: 180 } }}
                >
                  Reset filters
                </Button>
              </Stack>

              <CategoryTabs
                categories={data.categories}
                activeCategoryId={activeCategoryId}
                onSelectCategory={(categoryId) =>
                  startTransition(() => {
                    setActiveCategoryId(categoryId);
                  })
                }
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Box>
                  <Typography variant="h6">Featured categories</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fast access to the menu sections that drive most orders.
                  </Typography>
                </Box>
                <Chip icon={<SearchRoundedIcon />} label={`${data.menuItems.length} dishes`} />
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(3, minmax(0, 1fr))",
                    lg: "repeat(4, minmax(0, 1fr))"
                  },
                  gap: 1.5
                }}
              >
                {featuredCategories.map((category) => {
                  const count = data.menuItems.filter((item) => item.categoryId === category.id).length;
                  return (
                    <Card
                      key={category.id}
                      onClick={() =>
                        startTransition(() => {
                          setActiveCategoryId(category.id);
                        })
                      }
                      sx={{
                        cursor: "pointer",
                        overflow: "hidden",
                        border:
                          activeCategoryId === category.id ? "1px solid rgba(15,118,110,0.32)" : undefined,
                        boxShadow:
                          activeCategoryId === category.id ? "0 14px 30px rgba(15,118,110,0.10)" : undefined
                      }}
                    >
                      <Box
                        component="img"
                        src={category.image}
                        alt={category.name}
                        sx={{ width: "100%", aspectRatio: "1.1 / 1", objectFit: "cover" }}
                      />
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight={850} noWrap>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                          {count} dishes
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {sections.length === 0 ? (
          <EmptyState
            title="No dishes matched that search"
            description="Try a broader flavour, ingredient, or category to see more of the menu."
            actionLabel="Clear search"
            onAction={() => {
              setSearch("");
              setActiveCategoryId("");
            }}
          />
        ) : null}

        {activeCategoryId && activeSection ? (
          <Card>
            <CardContent sx={{ p: 2.25 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Showing category
                  </Typography>
                  <Typography variant="h6">{activeSection.name}</Typography>
                </Box>
                <Button size="small" onClick={() => setActiveCategoryId("")}>Show all sections</Button>
              </Stack>
            </CardContent>
          </Card>
        ) : null}

        <Box
          sx={{
            display: "grid",
            gap: 2.25,
            gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 360px" },
            alignItems: "start"
          }}
        >
          <Stack spacing={2.25}>
            {sections.map((section) => (
              <Card key={section.id}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="h6">{section.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {section.description}
                        </Typography>
                      </Box>
                      <Chip label={`${section.items.length} items`} variant="outlined" />
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gap: 1.5,
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))"
                        }
                      }}
                    >
                      {section.items.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          currency={currency}
                          onOpen={() => setSelectedItem(item)}
                          onQuickAdd={() => handleQuickAdd(item)}
                        />
                      ))}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Stack spacing={2.25} sx={{ position: { xl: "sticky" }, top: { xl: 16 } }}>
            <Card>
              <CardContent sx={{ p: 2.25 }}>
                <Stack spacing={1.4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Shortcuts
                  </Typography>
                  <Typography variant="h6">Stay focused</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the floating cart if you are in a hurry. The menu stays scroll-light and touch friendly.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(APP_ROUTES.cart(restaurantId, tableId, seatId))}
                  >
                    Review cart
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {lastOrder ? (
              <LiveOrderBanner
                order={lastOrder}
                restaurantId={restaurantId}
                tableId={tableId}
                seatId={seatId}
                onOpenTracking={() =>
                  navigate(APP_ROUTES.tracking(restaurantId, tableId, lastOrder.id, seatId))
                }
              />
            ) : null}

            <Card>
              <CardContent sx={{ p: 2.25 }}>
                <Stack spacing={1.15}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Basket total
                  </Typography>
                  <Typography variant="h4" sx={{ fontSize: 30 }}>
                    {formatCurrency(summary.total, currency)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {itemCount} item{itemCount === 1 ? "" : "s"} ready to checkout.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => navigate(APP_ROUTES.cart(restaurantId, tableId, seatId))}
                    disabled={!itemCount}
                  >
                    Go to cart
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>

      <MenuItemDialog
        open={Boolean(selectedItem)}
        item={selectedItem}
        currency={currency}
        onClose={() => setSelectedItem(null)}
        onAdd={handleDialogAdd}
      />

      <StickyCartBar
        itemCount={itemCount}
        total={summary.total}
        currency={currency}
        label="Your cart is live"
        actionLabel="Open cart"
        onAction={() => navigate(APP_ROUTES.cart(restaurantId, tableId, seatId))}
      />
    </CustomerLayout>
  );
}
