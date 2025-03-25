import ReactQuill from 'react-quill';
import { useEffect, useState } from 'react';
import { IonButton } from '@ionic/react';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import {
  UseFormRegister,
  UseFormSetValue,
  FieldError,
  UseFormGetValues,
  get,
} from 'react-hook-form';

import './htmlEditorForm.css';
import { set } from 'date-fns';

interface HtmlEditorFormProps {
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  showPreview?: boolean;
}

const HtmlEditorForm: React.FC<HtmlEditorFormProps> = ({
  showPreview = false,
  setValue,
  getValues,
}) => {
  const [editorHtml, setEditorHtml] = useState<string>('');

  // Quill modules to attach to editor
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      // Toggle to add custom logic here or defaults to native behavior
      matchVisual: false,
    },
  };

  // Quill editor formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];

  const handleChange = (html: string) => {
    setEditorHtml(html);
    if (setValue) {
      setValue('termsAndConditions', html, { shouldDirty: true });
    }
  };

  useEffect(() => {
    if (getValues) {
      setEditorHtml(getValues('termsAndConditions') || '');
    }
  }, [getValues]);

  return (
    <div className='editor-container'>
      <ReactQuill
        theme='snow'
        modules={modules}
        formats={formats}
        value={editorHtml}
        onChange={handleChange}
        placeholder='Compose your content here...'
      />

      {/* Preview section */}
      {editorHtml && showPreview && (
        <div className='preview-container ion-margin-top'>
          <h4>Preview:</h4>
          <div
            className='html-preview'
            dangerouslySetInnerHTML={{ __html: editorHtml }}
          />
        </div>
      )}
    </div>
  );
};

export default HtmlEditorForm;
