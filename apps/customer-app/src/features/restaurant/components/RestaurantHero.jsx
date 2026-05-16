import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import DeliveryDiningRoundedIcon from "@mui/icons-material/DeliveryDiningRounded";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

function InfoChip({ icon, label }) {
  return (
    <Chip
      icon={icon}
      label={label}
      variant="outlined"
      sx={{
        bgcolor: "rgba(255,255,255,0.88)",
        borderColor: "rgba(255,255,255,0.55)"
      }}
    />
  );
}

export function RestaurantHero({ restaurant, tableLabel }) {
  if (!restaurant) {
    return null;
  }

  const highlights = restaurant.ambienceHighlights || [];
  const image = restaurant.heroImage || restaurant.image;

  return (
    <Card
      sx={{
        overflow: "hidden",
        mb: { xs: 2, md: 3 },
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,248,245,0.95) 100%)"
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
            gap: { xs: 0, md: 2 },
            alignItems: "stretch"
          }}
        >
          <Stack spacing={2.25} sx={{ p: { xs: 2.25, sm: 3, md: 4 } }}>
            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip
                  label={tableLabel ? `Table ${tableLabel}` : "Tableside dining"}
                  color="primary"
                  sx={{ fontWeight: 800 }}
                />
                <Chip label={restaurant.address || "Restaurant experience"} variant="outlined" />
              </Stack>
              <Typography variant="h3" sx={{ fontSize: { xs: 30, md: 42 }, lineHeight: 1.02 }}>
                {restaurant.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {restaurant.tagline || restaurant.description}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <InfoChip icon={<StarsRoundedIcon fontSize="small" />} label={restaurant.rating || "4.8"} />
              <InfoChip
                icon={<AccessTimeRoundedIcon fontSize="small" />}
                label={restaurant.estimatedPrepTime || "18-22 min"}
              />
              <InfoChip
                icon={<DeliveryDiningRoundedIcon fontSize="small" />}
                label={restaurant.hook || "Scan and order at the table"}
              />
            </Stack>

            {highlights.length ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {highlights.slice(0, 3).map((item) => (
                  <Chip key={item} label={item} variant="outlined" />
                ))}
              </Stack>
            ) : null}

            {restaurant.description ? (
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                {restaurant.description}
              </Typography>
            ) : null}
          </Stack>

          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 220, md: "100%" },
              background:
                "linear-gradient(180deg, rgba(226,55,68,0.06), rgba(255,142,110,0.10))",
              p: { xs: 2.25, sm: 3, md: 3 }
            }}
          >
            <Box
              component="img"
              src={image}
              alt={restaurant.name}
              sx={{
                width: "100%",
                height: { xs: 240, sm: 280, md: "100%" },
                minHeight: { md: 360 },
                objectFit: "cover",
                borderRadius: 6,
                boxShadow: "0 20px 50px rgba(17, 24, 39, 0.12)"
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: { xs: 28, md: 34 },
                bottom: { xs: 28, md: 34 },
                px: 2,
                py: 1,
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                boxShadow: "0 10px 30px rgba(17, 24, 39, 0.10)"
              }}
            >
              <Typography variant="body2" fontWeight={800}>
                Table {tableLabel || "—"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
