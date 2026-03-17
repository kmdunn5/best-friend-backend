import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import { SI_COLORS, SI_GRADIENTS } from './siTheme';

interface SpiritIslandLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: 'Spirits', path: '/spirit-island/spirits' },
  { label: 'Adversaries', path: '/spirit-island/adversaries' },
  { label: 'Powers', path: '/spirit-island/powers' },
  { label: 'Games', path: '/spirit-island/games' },
  { label: 'Stats', path: '/spirit-island/stats' },
];

export default function SpiritIslandLayout({ children }: SpiritIslandLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = NAV_ITEMS.findIndex(item =>
    location.pathname.startsWith(item.path)
  );

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(NAV_ITEMS[newValue].path);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: SI_COLORS.parchment }}>
      {/* Header */}
      <Box sx={{
        background: SI_GRADIENTS.header,
        py: { xs: 3, sm: 4 },
        px: 2,
        position: 'relative',
      }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 12 },
            left: { xs: 8, sm: 16 },
            color: SI_COLORS.textOnDark,
            opacity: 0.7,
            '&:hover': { opacity: 1 },
          }}
          size="small"
        >
          <HomeIcon />
        </IconButton>

        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              color: SI_COLORS.textOnDark,
              fontWeight: 800,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3rem' },
              letterSpacing: '0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            Spirit Island
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: SI_COLORS.goldLight,
              textAlign: 'center',
              mt: 0.5,
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
            }}
          >
            Game Tracker & Reference
          </Typography>
        </Container>
      </Box>

      {/* Navigation */}
      <Box sx={{
        bgcolor: SI_COLORS.forestDark,
        borderBottom: `2px solid ${SI_COLORS.gold}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Container maxWidth="lg">
          <Tabs
            value={currentTab >= 0 ? currentTab : false}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                color: SI_COLORS.textOnDark,
                opacity: 0.7,
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                minHeight: 48,
                '&:hover': { opacity: 1 },
                '&.Mui-selected': {
                  color: SI_COLORS.goldLight,
                  opacity: 1,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: SI_COLORS.gold,
                height: 3,
              },
            }}
          >
            {NAV_ITEMS.map(item => (
              <Tab key={item.path} label={item.label} />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {children}
      </Container>
    </Box>
  );
}
