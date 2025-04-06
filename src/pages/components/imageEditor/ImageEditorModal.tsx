import {
  CenterContainer,
  ModalPageLayout,
} from '@src/pages/components/layouts';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  IonLoading,
  IonProgressBar,
} from '@ionic/react';
import { bus, camera, image } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';

import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@src/infrastructure/firebase/firebase.config';

import './imageEditor.css';
import { set } from 'date-fns';

interface ImageEditorModalProps {
  businessId?: string;
  imageUrl?: string;
  onUpdatedImage?: (imageUrl: string) => void;
  onDismiss: (data?: any, role?: string) => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  businessId,
  imageUrl,
  onUpdatedImage,
  onDismiss,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { showErrorNotification, showNotification } = useAppNotifications();

  const handleEditorSave = (editedImageObject: any) => {
    setEditedImage(editedImageObject.imageBase64);
    setShowEditor(false);

    //setActiveSegment('save');
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    // If we haven't edited the image yet, go back to upload
    if (!editedImage) {
      setSelectedImage('');
      setEditedImage(null);
    }
    onDismiss();
  };

  // Function to save the edited image to Firebase Storage
  const saveImage = async () => {
    if (!editedImage) {
      showErrorNotification('No image to save.');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Convert data URL to blob
      const response = await fetch(editedImage);
      const blob = await response.blob();

      // Generate a unique filename
      const fileName = `image_${new Date().getTime()}.jpg`;
      const storageRef = ref(
        storage,
        `businesses/${businessId}/images/${fileName}`
      );

      // Upload image with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Handle upload errors
          console.error('Upload error:', error);
          showErrorNotification('Error uploading image. Please try again.');
          setLoading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUpdatedImage?.(downloadURL);
          showNotification('Image uploaded successfully.');
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error preparing image for upload:', error);
      showErrorNotification(
        'Error preparing image for upload. Please try again.'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editedImage) {
      saveImage();
    }
  }, [editedImage]);

  useEffect(() => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowEditor(true);
    }
  }, [imageUrl]);

  return (
    <ModalPageLayout
      title={'Edit Image'}
      onDismiss={onDismiss}
      showHeader={false}
    >
      {loading && (
        <IonProgressBar
          //isOpen={loading}
          //message={'Uploading image...'}
          value={uploadProgress / 100}
        />
      )}

      <div>
        {selectedImage && (
          <div className='image-editor-container'>
            <FilerobotImageEditor
              source={selectedImage || ''}
              onSave={handleEditorSave}
              onClose={handleEditorClose}
              annotationsCommon={{
                fill: '#ff0000',
              }}
              tabsIds={[
                TABS.ADJUST,
                TABS.ANNOTATE,
                TABS.FILTERS,
                TABS.FINETUNE,
                TABS.RESIZE,
              ]}
              defaultTabId={TABS.ADJUST}
              defaultToolId={TOOLS.CROP}
              savingPixelRatio={4}
              previewPixelRatio={4}
              theme={{
                palette: {
                  'bg-primary-active': '#f3784d',
                  'bg-primary-hover': '#ffffff',
                  'icons-primary': '#f3784d',

                  'accent-primary-active': '#ffffff',
                  'accent-primary-hover': '#ffffff',

                  //'accent-stateless': '#f3784d',
                  'txt-primary': '#f3784d',
                  'btn-secondary-text': '#f3784d',
                  warning: '#f3784d',
                },
              }}
            />
          </div>
        )}
      </div>
    </ModalPageLayout>
  );
};

export default ImageEditorModal;

export const useImageEditorModal = (): {
  open: (
    businessId?: string,
    imageUrl?: string,
    onUpdatedImage?: (imageUrl: string) => void
  ) => Promise<{ imageUrl: string; role: string }>;
} => {
  const [inputs, setInputs] = useState<{
    businessId?: string;
    imageUrl?: string;
    onUpdatedImage?: (imageUrl: string) => void;
  }>();

  const [present, dismiss] = useIonModal(ImageEditorModal, {
    businessId: inputs?.businessId,
    imageUrl: inputs?.imageUrl,
    onUpdatedImage: inputs?.onUpdatedImage,
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return {
    open: (
      businessId?: string,
      imageUrl?: string,
      onUpdatedImage?: (imageUrl: string) => void
    ) => {
      setInputs({
        businessId: businessId,
        imageUrl: imageUrl,
        onUpdatedImage: onUpdatedImage,
      });
      return new Promise(async (resolve) => {
        present({
          onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            if (ev.detail.role) {
              resolve({ imageUrl: ev.detail.data, role: ev.detail.role });
            }
          },
        });
      });
    },
  };
};
