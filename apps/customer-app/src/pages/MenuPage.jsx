import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { ErrorState } from "../components/states/ErrorState.jsx";
import { LoadingState } from "../components/states/LoadingState.jsx";
import { APP_ROUTES } from "../constants/routes.js";
import { CartItemCard } from "../features/cart/components/CartItemCard.jsx";
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

export function MenuPage() {
  const { restaurantId, tableId } = useParams();
  const [searchParams] = useSearchParams();
  const seatId = searchParams.get("seat") || "";
  const navigate = useNavigate();
  const { loading, error, data } = useRestaurantExperience(restaurantId, tableId, seatId);
  const {
    cartItems,
    itemCount,
    summary,
    restaurant,
    hydrateRestaurant,
    addToCart,
    changeQuantity,
    removeItem
  } = useOrdering();
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    if (!data) {
      return;
    }

    hydrateRestaurant({
      session: data.session,
      restaurant: data.restaurant,
      table: data.table,
      pricing: data.pricing,
      paymentMethods: data.paymentMethods
    });
  }, [data, hydrateRestaurant]);

  const sections = useMemo(() => {
    if (!data) {
      return [];
    }

    const query = deferredSearch.trim().toLowerCase();

    return data.categories
      .filter((category) => !activeCategoryId || category.id === activeCategoryId)
      .map((category) => ({
        ...category,
        items: data.menuItems.filter((item) => {
          if (item.categoryId !== category.id) {
            return false;
          }

          if (!query) {
            return true;
          }

          return [item.name, item.description, item.ingredients.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(query);
        })
      }))
      .filter((category) => category.items.length > 0);
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
  const visibleSections = activeCategoryId ? (activeSection ? [activeSection] : []) : sections;

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

  return (
    <CustomerLayout>
      <RestaurantHero restaurant={data.restaurant} tableLabel={data.table.label} />

      <Stack spacing={3}>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 320px" },
            alignItems: "start"
          }}
        >
          <Stack spacing={3}>
            <Card>
              <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                <Stack spacing={2.25}>
                  <Stack spacing={0.5}>
                    <Typography variant="h5">Featured categories</Typography>
                    <Typography color="text.secondary">
                      Move fast with chef-picked sections, then fine-tune with search.
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.5,
                      gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }
                    }}
                  >
                    {featuredCategories.map((category) => (
                      <Paper
                        key={category.id}
                        onClick={() =>
                          startTransition(() => {
                            setActiveCategoryId(category.id);
                          })
                        }
                        sx={{
                          p: 1.2,
                          borderRadius: 4,
                          cursor: "pointer",
                          border:
                            activeCategoryId === category.id
                              ? "1px solid rgba(155, 91, 61, 0.28)"
                              : "1px solid rgba(121, 88, 71, 0.08)"
                        }}
                      >
                        <Stack spacing={1.2}>
                          <Box
                            sx={{
                              height: 100,
                              borderRadius: 3,
                              backgroundImage: `url(${category.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center"
                            }}
                          />
                          <Typography fontWeight={700}>{category.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {category.description}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Paper
              sx={{
                position: "sticky",
                top: { xs: 10, md: 18 },
                zIndex: 5,
                p: { xs: 1.5, md: 2 },
                borderRadius: 5
              }}
            >
              <Stack spacing={1.5}>
                <MenuSearchBar value={search} onChange={setSearch} />
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
            </Paper>

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
              <Paper sx={{ p: 2, borderRadius: 4, mb: 2, backgroundColor: "rgba(255,255,255,0.95)" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Box>
                    <Typography variant="h6">Showing:</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {activeSection.name}
                    </Typography>
                  </Box>
                  <Button size="small" onClick={() => setActiveCategoryId("")}>Show all sections</Button>
                </Stack>
              </Paper>
            ) : null}

            {visibleSections.map((section) => (
              <Accordion key={section.id} defaultExpanded={activeCategoryId === section.id} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreRoundedIcon />}
                  sx={{ paddingX: 2, paddingY: 1.5, backgroundColor: "rgba(255,255,255,0.96)" }}
                >
                  <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Typography variant="h5">{section.name}</Typography>
                    <Typography color="text.secondary">{section.description}</Typography>
                  </Stack>
                  <Chip
                    label={`${section.items.length} item${section.items.length > 1 ? "s" : ""}`}
                    sx={{ ml: 2 }}
                  />
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 2, pt: 0 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }
                    }}
                  >
                    {section.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        currency={currency}
                        onOpenDetails={setSelectedItem}
                        onQuickAdd={handleQuickAdd}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>

          <Stack spacing={2} sx={{ display: { xs: "none", lg: "flex" }, position: "sticky", top: 18 }}>
            <Card>
              <CardContent sx={{ p: 2.25 }}>
                <Stack spacing={1.25}>
                  <Typography variant="h5">Your table</Typography>
                  <Typography color="text.secondary">
                    {restaurant?.name || data.restaurant.name} • {data.table.label}
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {data.restaurant.ambienceHighlights.map((highlight) => (
                      <Chip key={highlight} label={highlight} />
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2.25 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Cart preview</Typography>
                    <Chip icon={<BoltRoundedIcon />} label={`${itemCount} items`} color="primary" />
                  </Stack>

                  {cartItems.length === 0 ? (
                    <Typography color="text.secondary">
                      Add a few plates to unlock the fast checkout flow.
                    </Typography>
                  ) : (
                    <Stack spacing={1.5}>
                      {cartItems.slice(0, 2).map((item) => (
                        <CartItemCard
                          key={item.key}
                          item={item}
                          currency={currency}
                          onIncrease={() => changeQuantity(item.key, 1)}
                          onDecrease={() => changeQuantity(item.key, -1)}
                          onRemove={removeItem}
                        />
                      ))}
                      {cartItems.length > 2 ? (
                        <Typography variant="body2" color="text.secondary">
                          +{cartItems.length - 2} more item{cartItems.length - 2 > 1 ? "s" : ""}
                        </Typography>
                      ) : null}
                    </Stack>
                  )}

                  <Paper
                    sx={{
                      p: 1.5,
                      borderRadius: 4,
                      background: "linear-gradient(135deg, rgba(42,29,25,0.95), rgba(112,128,96,0.95))",
                      color: "#fff9f2"
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="body2" sx={{ color: "rgba(255,249,242,0.72)" }}>
                        Running total
                      </Typography>
                      <Typography variant="h4">{formatCurrency(summary.total, currency)}</Typography>
                    </Stack>
                  </Paper>

                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardRoundedIcon />}
                      disabled={cartItems.length === 0}
                      onClick={() => navigate(APP_ROUTES.cart(restaurantId, tableId, seatId))}
                    >
                      View cart
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
        onConfirm={(payload) => {
          addToCart(createCartLine(payload));
          setSelectedItem(null);
        }}
      />

      {itemCount > 0 ? (
        <StickyCartBar
          itemCount={itemCount}
          total={summary.total}
          currency={currency}
          label="Your table is ready for checkout"
          actionLabel="View cart"
          onAction={() => navigate(APP_ROUTES.cart(restaurantId, tableId, seatId))}
        />
      ) : null}
    </CustomerLayout>
  );
}
