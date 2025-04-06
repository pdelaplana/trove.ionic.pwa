import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { cloudUpload, camera, image } from 'ionicons/icons';
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';
import './imageUploader.css';

import { storage } from '@src/infrastructure/firebase/firebase.config';

const ImageUploader: React.FC = () => {
  // State variables
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [activeSegment, setActiveSegment] = useState<string>('upload');
  const [showEditor, setShowEditor] = useState<boolean>(false);

  // Function to handle image selection from gallery
  const selectImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      setSelectedImage(image.dataUrl || null);
      setActiveSegment('edit');
      setShowEditor(true);
    } catch (error) {
      console.error('Error selecting image:', error);
      setToastMessage('Error selecting image. Please try again.');
      setShowToast(true);
    }
  };

  // Function to take a photo with camera
  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      setSelectedImage(image.dataUrl || null);
      setActiveSegment('edit');
      setShowEditor(true);
    } catch (error) {
      console.error('Error taking photo:', error);
      setToastMessage('Error taking photo. Please try again.');
      setShowToast(true);
    }
  };

  // Function to handle editor save
  const handleEditorSave = (editedImageObject: any) => {
    setEditedImage(editedImageObject.imageBase64);
    setShowEditor(false);
    setActiveSegment('save');
  };

  // Function to handle editor close
  const handleEditorClose = () => {
    setShowEditor(false);
    // If we haven't edited the image yet, go back to upload
    if (!editedImage) {
      setActiveSegment('upload');
    }
  };

  // Function to save the edited image to Firebase Storage
  const saveImage = async () => {
    if (!editedImage) {
      setToastMessage('No image to save.');
      setShowToast(true);
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
      const storageRef = ref(storage, `images/${fileName}`);

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
          setToastMessage('Error uploading image. Please try again.');
          setShowToast(true);
          setLoading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Image uploaded successfully. URL:', downloadURL);
          setToastMessage('Image saved successfully!');
          setShowToast(true);
          setLoading(false);

          // You can do something with the download URL here,
          // like saving it to Firestore or passing it to a parent component
        }
      );
    } catch (error) {
      console.error('Error preparing image for upload:', error);
      setToastMessage('Error preparing image for upload. Please try again.');
      setShowToast(true);
      setLoading(false);
    }
  };

  // Function to go back to edit
  const goBackToEdit = () => {
    setShowEditor(true);
    setActiveSegment('edit');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Image Uploader</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding'>
        <IonSegment
          value={activeSegment}
          onIonChange={(e) => setActiveSegment(e.detail.value as string)}
        >
          <IonSegmentButton value='upload'>
            <IonLabel>Upload</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='edit' disabled={!selectedImage}>
            <IonLabel>Edit</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='save' disabled={!editedImage}>
            <IonLabel>Save</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {activeSegment === 'upload' && (
          <IonCard>
            <IonCardContent className='ion-text-center'>
              <h2>Select an Image</h2>
              <p>Choose an image from your gallery or take a new photo</p>

              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonButton expand='block' onClick={selectImage}>
                      <IonIcon slot='start' icon={image} />
                      Gallery
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton expand='block' onClick={takePhoto}>
                      <IonIcon slot='start' icon={camera} />
                      Camera
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )}

        {showEditor && selectedImage && (
          <div className='editor-container'>
            <FilerobotImageEditor
              source={selectedImage}
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
                  'bg-primary': '#f4f5f8',
                  'bg-secondary': '#ffffff',
                  'accent-primary': '#3880ff',
                  'accent-secondary': '#3dc2ff',
                },
              }}
            />
          </div>
        )}

        {activeSegment === 'edit' && !showEditor && selectedImage && (
          <IonCard>
            <IonCardContent className='ion-text-center'>
              <h2>Edit Image</h2>
              <IonButton expand='block' onClick={() => setShowEditor(true)}>
                Open Editor
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {activeSegment === 'save' && editedImage && (
          <IonCard>
            <IonCardContent className='ion-text-center'>
              <h2>Save to Firebase Storage</h2>
              <div className='image-preview-container'>
                <img
                  src={editedImage}
                  alt='Final Preview'
                  className='image-preview'
                />
              </div>

              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonButton
                      expand='block'
                      onClick={goBackToEdit}
                      fill='outline'
                    >
                      Edit Again
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      expand='block'
                      onClick={saveImage}
                      disabled={loading}
                    >
                      <IonIcon slot='start' icon={cloudUpload} />
                      {loading
                        ? `Uploading... ${Math.round(uploadProgress)}%`
                        : 'Save Image'}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )}

        <IonLoading
          isOpen={loading}
          message={'Uploading image...'}
          //progress={uploadProgress / 100}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default ImageUploader;
