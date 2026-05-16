import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TableBarRoundedIcon from "@mui/icons-material/TableBarRounded";
import { Box, Card, Chip, Stack, Typography } from "@mui/material";

export function RestaurantHero({ restaurant, tableLabel }) {
  return (
    <Card
      sx={{
        overflow: "hidden",
        position: "relative",
        mb: 3,
        borderRadius: { xs: 6, md: 8 }
      }}
    >
      <Box
        sx={{
          minHeight: { xs: 360, md: 420 },
          p: { xs: 2.5, sm: 3, md: 4 },
          display: "flex",
          alignItems: "end",
          backgroundImage: `linear-gradient(180deg, rgba(28,18,12,0.14) 10%, rgba(28,18,12,0.82) 100%), url(${restaurant.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Stack spacing={2.25} sx={{ maxWidth: 620, color: "#fffaf5" }}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip
              label={`Welcome to ${restaurant.name}`}
              sx={{ bgcolor: "rgba(255,250,245,0.16)", color: "inherit" }}
            />
            <Chip
              icon={<TableBarRoundedIcon sx={{ color: "inherit !important" }} />}
              label={tableLabel}
              sx={{ bgcolor: "rgba(255,250,245,0.16)", color: "inherit" }}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.3rem", md: "3.5rem" } }}>
              {restaurant.tagline}
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,250,245,0.84)", maxWidth: 560 }}>
              {restaurant.hook}
            </Typography>
            <Typography sx={{ color: "rgba(255,250,245,0.72)", maxWidth: 600 }}>
              {restaurant.description}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
            <Chip
              icon={<StarRoundedIcon sx={{ color: "#f3d389 !important" }} />}
              label={`${restaurant.rating} diner rating`}
              sx={{ bgcolor: "rgba(255,250,245,0.14)", color: "inherit" }}
            />
            <Chip
              icon={<AccessTimeRoundedIcon sx={{ color: "inherit !important" }} />}
              label={restaurant.estimatedPrepTime}
              sx={{ bgcolor: "rgba(255,250,245,0.14)", color: "inherit" }}
            />
            <Chip
              icon={<PlaceRoundedIcon sx={{ color: "inherit !important" }} />}
              label={restaurant.address}
              sx={{ bgcolor: "rgba(255,250,245,0.14)", color: "inherit" }}
            />
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
