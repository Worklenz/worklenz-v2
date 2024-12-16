// DescriptionEditor.tsx
import React, { useState } from 'react';
import { Input } from 'antd';

const DescriptionEditor = ({ description }: { description: string | null }) => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  return isEditorOpen ? (
    <div></div>
  ) : (
    <Input.TextArea
      defaultValue={description || ''}
      placeholder="Add a more detailed description..."
      onFocus={() => setIsEditorOpen(true)}
    />
  );
};

export default DescriptionEditor;
