import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

function InfoChip({ icon, label }) {
  return (
    <Chip
      icon={icon}
      label={label}
      variant="outlined"
      sx={{
        bgcolor: "rgba(255,255,255,0.9)",
        borderColor: "rgba(215,224,218,0.95)"
      }}
    />
  );
}

export function RestaurantHero({ restaurant, tableLabel }) {
  if (!restaurant) return null;
  const highlights = restaurant.ambienceHighlights || [];
  const image = restaurant.heroImage || restaurant.image;

  return (
    <Card
      sx={{
        overflow: "hidden",
        mb: { xs: 2, md: 2.5 },
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,247,241,0.97) 100%)"
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            gap: 0
          }}
        >
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 220, md: 360 },
              background:
                "linear-gradient(135deg, rgba(15,118,110,0.16), rgba(192,138,62,0.14))"
            }}
          >
            <Box
              component="img"
              src={image}
              alt={restaurant.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(24,34,48,0.02) 0%, rgba(24,34,48,0.18) 100%)"
              }}
            />
            <Stack
              spacing={1}
              sx={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 16
              }}
            >
              <Chip
                label={tableLabel ? `Table ${tableLabel}` : "Dine-in session"}
                sx={{ width: "fit-content", bgcolor: "rgba(255,255,255,0.95)" }}
              />
              <Typography variant="h4" sx={{ color: "#fff", fontSize: { xs: 26, md: 34 } }}>
                {restaurant.name}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.92)", maxWidth: 540 }}>
                {restaurant.tagline || restaurant.hook}
              </Typography>
            </Stack>
          </Box>

          <Stack spacing={2.25} sx={{ p: { xs: 2, md: 3 }, justifyContent: "space-between" }}>
            <Stack spacing={1.2}>
              <Typography variant="subtitle2" color="text.secondary">
                The dining room
              </Typography>
              <Typography variant="h5">{restaurant.hook}</Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {restaurant.description}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <InfoChip icon={<StarsRoundedIcon />} label={`Rating ${restaurant.rating || "4.8"}`} />
              <InfoChip icon={<AccessTimeRoundedIcon />} label={restaurant.estimatedPrepTime || "18-22 min"} />
              <InfoChip icon={<PlaceRoundedIcon />} label={restaurant.address || "Dining area"} />
            </Stack>

            <Stack spacing={1}>
              {highlights.slice(0, 3).map((highlight) => (
                <Box
                  key={highlight}
                  sx={{
                    px: 1.5,
                    py: 1.1,
                    borderRadius: 3,
                    border: "1px solid rgba(215,224,218,0.95)",
                    bgcolor: "rgba(255,255,255,0.88)"
                  }}
                >
                  <Typography variant="body2" fontWeight={700}>
                    {highlight}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
