import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CongratsPortfolio = () => {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={200}
      />
      <Card className="w-full max-w-md border-2 border-primary shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex items-center justify-center gap-2"
            >
              <Briefcase className="h-8 w-8" />
              Congratulations!
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center pt-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg mb-4"
          >
            You've successfully created your first portfolio!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-muted-foreground"
          >
            Your journey to smart investing begins now. Let's start rebalancing
            and growing your assets!
          </motion.p>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button onClick={() => navigate('/demo')} className="font-semibold">
              Go to Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  );
};
