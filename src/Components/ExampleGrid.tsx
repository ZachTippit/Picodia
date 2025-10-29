import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import ExampleRow from './ExampleRow';

interface ExampleGridProps {
  nextStart: number;
  order: number;
}

const ExampleGrid = ({ nextStart, order }: ExampleGridProps) => {
  const [nextAnim, setNextAnim] = useState(-1);

  const onToNext = () => {
    setNextAnim(nextAnim + 1);
  };

  useEffect(() => {
    nextStart === order && setNextAnim(0);
  }, [nextStart, order]);

  return (
    <Grid
      container
      columns={4}
      width="70%"
      mb={4}
      justifyContent="center"
      className="ex-grid3-3"
      ml={4}
    >
      <Grid container columns={13} width="70%" marginLeft="2rem" className="ex-grid">
        <Grid size={{ xs: 3 }} alignSelf="center">
          <p className="m-0 text-right pr-2"> </p>
        </Grid>
        <Grid size={{ xs: 1 }} alignSelf="center">
          <p className="m-0 text-center pr-2">3</p>
        </Grid>
        <Grid size={{ xs: 1 }} alignSelf="center">
          <p className="m-0 text-center pr-2">1</p>
        </Grid>
        <Grid size={{ xs: 1 }} alignSelf="center">
          <p className="m-0 text-center pr-2">1</p>
          <p className="m-0 text-center pr-2">1</p>
        </Grid>
      </Grid>
      <ExampleRow
        exClue="3"
        exArray={[1, 1, 1]}
        nextStart={nextAnim}
        order={0}
        onToNext={onToNext}
      />
      <ExampleRow
        exClue="1"
        exArray={[1, '', '']}
        nextStart={nextAnim}
        order={1}
        onToNext={onToNext}
      />
      <ExampleRow
        exClue="3"
        exArray={[1, 1, 1]}
        nextStart={nextAnim}
        order={2}
        onToNext={onToNext}
      />
    </Grid>
  );
};

export default ExampleGrid;
