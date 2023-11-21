import { memo } from 'react';

import { useSelectedDispatch } from '../../hooks/useSelected';
import ArrowThinRight from '../../icons/v1/ArrowThinRight';
import { theme } from '../../style';
import Text from '../common/Text';
import { Row, Cell, InputCell, SelectCell, CellButton } from '../table';

function RuleButton({ ruleCount, focused, onEdit, onClick }) {
  return (
    <Cell
      name="rule-count"
      width="auto"
      focused={focused}
      style={{ padding: '0 10px' }}
      plain
    >
      <CellButton
        style={{
          borderRadius: 4,
          padding: '3px 6px',
          backgroundColor: theme.noticeBackground,
          border: '1px solid ' + theme.noticeBackground,
          color: theme.noticeTextDark,
          fontSize: 12,
        }}
        onEdit={onEdit}
        onSelect={onClick}
        onFocus={onEdit}
      >
        <Text style={{ paddingRight: 5 }}>
          {ruleCount > 0 ? (
            <>
              {ruleCount} associated {ruleCount === 1 ? 'rule' : 'rules'}
            </>
          ) : (
            <>Create rule</>
          )}
        </Text>
        <ArrowThinRight style={{ width: 8, height: 8 }} />
      </CellButton>
    </Cell>
  );
}

const PayeeTableRow = memo(
  ({
    style,
    payee,
    ruleCount,
    selected,
    hovered,
    editing,
    focusedField,
    onViewRules,
    onCreateRule,
    onHover,
    onEdit,
    onUpdate,
  }) => {
    let { id } = payee;
    let dispatchSelected = useSelectedDispatch();
    let borderColor = selected ? theme.tableBorderSelected : theme.tableBorder;
    let backgroundFocus = hovered || focusedField === 'select';

    return (
      <Row
        style={{
          alignItems: 'stretch',
          ...style,
          borderColor,
          backgroundColor: hovered
            ? theme.tableRowBackgroundHover
            : selected
            ? theme.tableRowBackgroundHighlight
            : backgroundFocus
            ? theme.tableRowBackgroundHover
            : theme.tableBackground,
          ...(selected && {
            backgroundColor: theme.tableRowBackgroundHighlight,
            zIndex: 100,
          }),
        }}
        data-focus-key={payee.id}
        onMouseEnter={() => onHover && onHover(payee.id)}
      >
        <SelectCell
          exposed={
            payee.transfer_acct == null && (hovered || selected || editing)
          }
          focused={focusedField === 'select'}
          selected={selected}
          onSelect={e => {
            dispatchSelected({ type: 'select', id: payee.id, event: e });
          }}
        />
        <InputCell
          value={(payee.transfer_acct ? 'Transfer: ' : '') + payee.name}
          valueStyle={
            !selected && payee.transfer_acct && { color: theme.pageTextSubdued }
          }
          exposed={focusedField === 'name'}
          width="flex"
          onUpdate={value =>
            !payee.transfer_acct && onUpdate(id, 'name', value)
          }
          onExpose={() => onEdit(id, 'name')}
          inputProps={{ readOnly: !!payee.transfer_acct }}
        />
        <RuleButton
          ruleCount={ruleCount}
          focused={focusedField === 'rule-count'}
          onEdit={() => onEdit(id, 'rule-count')}
          onClick={() =>
            ruleCount > 0 ? onViewRules(payee.id) : onCreateRule(payee.id)
          }
        />
      </Row>
    );
  },
);

export default PayeeTableRow;