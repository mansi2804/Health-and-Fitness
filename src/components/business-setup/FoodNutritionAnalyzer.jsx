import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Grid, 
  Paper, 
  LinearProgress, 
  Chip, 
  ThemeProvider, 
  createTheme, 
  CssBaseline 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CloudUpload,
  Restaurant,
  LocalFireDepartment,
  FitnessCenter,
  Grain,
  LocalDrink,
  Cookie,
  SoupKitchen,
  Favorite,
  Medication,
  Apple,
  Science,
  Code,
  LocalDining
} from '@mui/icons-material';

// Create a dark theme with teal as primary color
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#18efc7',
    },
    secondary: {
      main: '#9eecd9',
    },
    background: {
      default: '#202127',
      paper: '#2d2e34',
    },
    text: {
      primary: '#f7f7f7',
      secondary: '#a0a0a0',
    },
    success: {
      main: '#28a745',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#dc3545',
    },
    info: {
      main: '#17a2b8',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      background: 'linear-gradient(90deg, #18efc7, #9eecd9)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
});

// Styled components
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  backgroundColor: 'rgba(24, 239, 199, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(24, 239, 199, 0.1)',
  },
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  overflow: 'hidden',
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const NutrientCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
}));

const IconCircle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

// Helper functions
const getNutrientIcon = (nutrientName) => {
  const name = nutrientName.toLowerCase();
  
  if (name.includes('fiber')) return <LocalDining />;
  if (name.includes('sugar')) return <Cookie />;
  if (name.includes('sodium') || name.includes('salt')) return <SoupKitchen />;
  if (name.includes('calcium')) return <FitnessCenter />;
  if (name.includes('iron')) return <FitnessCenter />;
  if (name.includes('vitamin')) return <Medication />;
  if (name.includes('potassium')) return <Apple />;
  if (name.includes('magnesium')) return <Medication />;
  if (name.includes('zinc')) return <Science />;
  if (name.includes('cholesterol')) return <Favorite />;
  if (name.includes('saturated')) return <LocalDrink />;
  
  return <Science />;
};

const formatNutrientValue = (value, nutrient) => {
  if (value === undefined || value === null) return 'N/A';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return value;
  
  const name = nutrient.toLowerCase();
  
  if (name.includes('calorie')) {
    return Math.round(numValue);
  } else if (name.includes('sodium') || name.includes('potassium')) {
    return `${Math.round(numValue)}mg`;
  } else if (name.includes('vitamin') || name.includes('percentage')) {
    return `${Math.round(numValue)}%`;
  } else {
    return `${numValue.toFixed(1)}g`;
  }
};

const formatFoodName = (className) => {
  if (!className) return "Food Item";
  
  return className
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Main component
const FoodNutritionAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('Upload an image and enter weight to see nutrition details.');
  const [showRawData, setShowRawData] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
      setMessage('Image uploaded successfully. Enter weight and click Analyze.');
      setResult(null);
      setError(null);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(droppedFile);
      setMessage('Image uploaded successfully. Enter weight and click Analyze.');
      setResult(null);
      setError(null);
    }
  };
  
  const handleAnalyze = async () => {
    if (!file || !weight) {
      setMessage('Please select an image and enter the weight in grams.');
      setResult(null);
      return;
    }
    
    setLoading(true);
    setMessage('Processing your image...');
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('weight', weight);
      
      const response = await fetch("http://127.0.0.1:8000/analyze/", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the API response to match our expected format
      const transformedResult = {
        predicted_class: data.food_name || "Unknown Food",
        probability: data.confidence ? parseFloat(data.confidence) : null,
        nutrition: {
          'Calories': data.calories,
          'Protein (g)': data.protein,
          'Carbohydrates (g)': data.carbohydrates,
          'Fat (g)': data.fats,
          'Fiber (g)': data.fiber,
          'Sugars (g)': data.sugars,
          'Sodium (mg)': data.sodium
        }
      };
      
      setResult(transformedResult);
      setMessage('Analysis complete!');
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze the image. Please try again.');
      setMessage('Error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      setFile(null);
      setPreviewUrl('');
      setWeight('');
      setLoading(false);
      setResult(null);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h1" align="center" gutterBottom>
          Food Nutrition Analyzer
        </Typography>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <UploadBox
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography align="center">Click or drag food image here</Typography>
              <Typography align="center" variant="caption" color="text.secondary">
                Supported formats: JPG, PNG, WEBP
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </UploadBox>
            
            <ImagePreview>
              {previewUrl ? (
                <PreviewImage src={previewUrl} alt="Food preview" />
              ) : (
                <Typography color="text.secondary">Image preview will appear here</Typography>
              )}
            </ImagePreview>
            
            <TextField
              fullWidth
              type="number"
              label="Food Weight (grams)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              InputProps={{
                inputProps: { min: 1 }
              }}
              margin="normal"
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAnalyze}
              disabled={loading}
              sx={{ mt: 2 }}
              startIcon={<LocalFireDepartment />}
            >
              {loading ? 'Analyzing...' : 'Analyze Nutrition'}
            </Button>
            
            {loading && <LinearProgress sx={{ mt: 2 }} />}
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </CardContent>
        </Card>
        
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Restaurant sx={{ mr: 1 }} />
          <Typography variant="h5">Analysis Result</Typography>
        </Box>
        
        <Card>
          <CardContent>
            {!result ? (
              <Box sx={{ textAlign: 'center', p: 2, color: 'text.secondary' }}>
                {message}
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconCircle>
                      <Restaurant />
                    </IconCircle>
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {weight}g
                      </Typography>
                    </Box>
                  </Box>
                  
                  {result.probability && (
                    <LinearProgress
                      variant="determinate"
                      value={result.probability * 100}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  )}
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={6} sm={3}>
                    <NutrientCard>
                      <IconCircle>
                        <LocalFireDepartment />
                      </IconCircle>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatNutrientValue(result.nutrition['Calories'], 'Calories')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Calories
                        </Typography>
                      </Box>
                    </NutrientCard>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <NutrientCard>
                      <IconCircle>
                        <FitnessCenter />
                      </IconCircle>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatNutrientValue(result.nutrition['Protein (g)'], 'Protein')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Protein
                        </Typography>
                      </Box>
                    </NutrientCard>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <NutrientCard>
                      <IconCircle>
                        <Grain />
                      </IconCircle>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatNutrientValue(result.nutrition['Carbohydrates (g)'], 'Carbohydrates')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Carbohydrates
                        </Typography>
                      </Box>
                    </NutrientCard>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <NutrientCard>
                      <IconCircle>
                        <LocalDrink />
                      </IconCircle>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatNutrientValue(result.nutrition['Fat (g)'], 'Fat')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fat
                        </Typography>
                      </Box>
                    </NutrientCard>
                  </Grid>
                </Grid>
                
                <SectionTitle variant="h6">Additional Nutrients</SectionTitle>
                
                <Grid container spacing={2}>
                  {Object.entries(result.nutrition).filter(([key]) => 
                    !["Calories", "Protein (g)", "Carbohydrates (g)", "Fat (g)"].includes(key)
                  ).map(([key, value]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <NutrientCard>
                        <IconCircle>
                          {getNutrientIcon(key)}
                        </IconCircle>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {formatNutrientValue(value, key)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {key.replace(/\([^)]*\)/g, '').trim()}
                          </Typography>
                        </Box>
                      </NutrientCard>
                    </Grid>
                  ))}
                </Grid>
                

                
                {showRawData && (
                  <Box 
                    component="pre"
                    sx={{ 
                      bgcolor: 'rgba(0,0,0,0.2)', 
                      p: 2, 
                      borderRadius: 2,
                      mt: 2,
                      overflowX: 'auto'
                    }}
                  >
                    {JSON.stringify(result, null, 2)}
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default FoodNutritionAnalyzer;