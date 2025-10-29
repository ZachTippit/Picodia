import { Grid } from '@mui/material';

interface CluesProps {
  cell: any[];
  index: number;
  rowOrCol: 'row' | 'column';
}

const Clues = ({ cell, index, rowOrCol }: CluesProps ) => {

  return (
    <Grid
      size={{ xs: rowOrCol === 'column' ? 1 : 2 }}
      className={`disable-select clue-${rowOrCol}-container`}
      key={`${rowOrCol}-clue@${index}`}
      draggable="false"
    >
      <Grid
        container
        direction={rowOrCol}
        columnSpacing={1}
        draggable="false"
        className="flex justify-end align-center h-full"
      >
        {cell.length > 0 ? (
          <>
            {cell.map((clue, index2) => (
              <Grid
                key={`${rowOrCol}-clue-item@${index2}`}
                className={`clue-${rowOrCol}`}
                draggable="false"
              >
                <p className={`fade-in-${rowOrCol}`} draggable="false">
                  {clue}
                </p>
              </Grid>
            ))}
          </>
        ) : (
          <Grid
            key={`${rowOrCol}-empty-clue-item@${index}`}
            className={`clue-${rowOrCol}`}
            draggable="false"
          >
            <p className={`fade-in-${rowOrCol}`} draggable="false">
              {' '}
            </p>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Clues;
