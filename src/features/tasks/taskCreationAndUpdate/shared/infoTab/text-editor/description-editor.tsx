// DescriptionEditor.tsx
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import TinyEditor from './tiny-editor';
import { themeWiseColor } from '../../../../../../utils/themeWiseColor';
import { useAppSelector } from '../../../../../../hooks/useAppSelector';

const DescriptionEditor = ({ description }: { description: string | null }) => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  // get theme details from theme reducer
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  // trigger re-render for TinyEditor on theme change
  const [editorKey, setEditorKey] = useState<number>(0);

  useEffect(() => {
    if (isEditorOpen) {
      setEditorKey((prevKey) => prevKey + 1);
    }
  }, [isEditorOpen, themeMode]);

  return isEditorOpen ? (
    <TinyEditor
      key={editorKey}
      initialValue={description}
      init={{
        height: 500,
        menubar: false,
        branding: false,
        highlight_on_focus: false,
        resize: false,
        skin: 'dark',
        content_css: 'dark',
        plugins: [
          'anchor',
          'autolink',
          'image',
          'link',
          'lists',
          'searchreplace',
          'table',
          'wordcount',
        ],
        toolbar:
          'blocks |' +
          'bold italic underline strikethrough |  ' +
          '| numlist bullist link |' +
          'alignleft aligncenter alignright alignjustify',
        content_style: `body { font-size:14px;  font-family: 'Inter', sans-serif; background: ${themeWiseColor('#fff', '#141414', themeMode)}; 
            color: ${themeWiseColor('#141414', '#fff', themeMode)}; }`,
      }}
    />
  ) : (
    <Input.TextArea
      defaultValue={description || ''}
      placeholder="Add a more detailed description..."
      onFocus={() => setIsEditorOpen(true)}
    />
  );
};

export default DescriptionEditor;
