'use client';

import { useStrudelEditor } from './hooks';
import { EditorErrorBoundary } from './error-boundary';
import { EditorToast } from './editor-toast';

export {
  isAudioContextSuspended,
  resumeAudioContext,
  evaluateStrudel,
  stopStrudel,
  previewSample,
} from './hooks';

interface StrudelEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
}

export function StrudelEditor({
  initialCode = '',
  onCodeChange,
  readOnly = false,
}: StrudelEditorProps) {
  const { containerRef } = useStrudelEditor(initialCode, onCodeChange, readOnly);

  return (
    <EditorErrorBoundary>
      <div className="relative h-full w-full">
        <div
          ref={containerRef}
          className="strudel-editor h-full w-full overflow-auto rounded-none"
        />
        <EditorToast />
      </div>
    </EditorErrorBoundary>
  );
}
