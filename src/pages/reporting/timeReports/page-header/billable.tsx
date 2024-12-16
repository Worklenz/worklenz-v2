import { CaretDownFilled } from "@ant-design/icons";
import { Button, Checkbox, Dropdown, MenuProps } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const Billable:React.FC = () => {
  
    const {t} = useTranslation('time-report')
    // Dropdown items for the menu
    const menuItems: MenuProps['items'] = [
        {
          key: 'search',
          label: (
            <Checkbox>{t('billable')}</Checkbox>
          ),
        },
      {
        key: 'selectAll',
        label: (
            <Checkbox>{t('nonBillable')}</Checkbox>
        ),
      },
    ];
  
    return (
      <div>
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomLeft"
          trigger={['click']}
          overlayStyle={{maxHeight: '330px', overflowY: 'auto'}}
        >
          <Button >
            {t('billable')} <CaretDownFilled />
          </Button>
        </Dropdown>
      </div>
    );
};

export default Billable;
