/** @jsx h */
import { Container, Dropdown, VerticalSpace } from '@create-figma-plugin/ui';
import produce from 'immer';
import { h, Fragment } from 'preact';
import { ColumnSpec, ColumnType } from '../dto/tableSpec';
import { FormState, FormStateSetter } from '../types';
import styles from './columnConfig.css';

const changeColumnType = produce((columns: ColumnSpec[], index: number, type: ColumnType) => {
  columns[index].type = type;
});

export const ColumnConfig = ({
  formState,
  setFormState,
}: {
  formState: FormState;
  setFormState: FormStateSetter;
}) => {
  return (
    <div className={styles.container}>
      <Container space="medium">
        <VerticalSpace space="medium" />
        <div className={styles.colTable}>
          <div className={styles.colHeader}>#</div>
          <div className={styles.colHeader}>Name</div>
          <div className={styles.colHeader}>Type</div>

          {formState.columns.map((c, i) => (
            <Fragment>
              <div>{i + 1}</div>
              <div>{c.name}</div>

              <Dropdown
                value={c.type}
                onChange={e =>
                  setFormState(
                    changeColumnType(formState.columns, i, e.currentTarget.value as ColumnType),
                    'columns'
                  )
                }
                options={[
                  {
                    value: 'Word',
                  },
                  {
                    value: 'Date',
                  },
                  {
                    value: 'Number',
                  },
                ]}
              />
            </Fragment>
          ))}
        </div>
      </Container>
    </div>
  );
};
