/**
 * WhiteboardOverlay
 * -----------------
 * Full-screen in-call whiteboard for the teacher to draw and explain,
 * and for students to watch. Also supports annotating a locally-picked
 * image (no upload — the image data is sent once to the room).
 */
import React, { useRef, useState } from 'react';
import {
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Circle, Path, Svg } from 'react-native-svg';

export interface WhiteboardPoint { x: number; y: number }

export interface WhiteboardStroke {
  id: string;
  points: WhiteboardPoint[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

export interface WhiteboardOverlayProps {
  visible: boolean;
  role: 'teacher' | 'student';
  strokes: WhiteboardStroke[];
  liveStroke: WhiteboardStroke | null;
  backgroundImage: string | null;
  penColor: string;
  penWidth: number;
  tool: 'pen' | 'eraser';
  onCommitStroke?: (stroke: WhiteboardStroke) => void;
  onProgressStroke?: (stroke: WhiteboardStroke) => void;
  onUndo?: () => void;
  onClear?: () => void;
  onPickImage?: () => void;
  onClose: () => void;
  onPenColorChange?: (color: string) => void;
  onPenWidthChange?: (w: number) => void;
  onToolChange?: (tool: 'pen' | 'eraser') => void;
}

const PEN_COLORS = ['#111827', '#DC2626', '#2563EB', '#059669', '#D97706'];
const PEN_WIDTHS = [2, 4, 7];

function pointsToPath(points: WhiteboardPoint[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')}`;
}

let strokeSeq = 0;
function nextStrokeId(): string {
  strokeSeq += 1;
  return `s${Date.now().toString(36)}_${strokeSeq}`;
}

export const WhiteboardOverlay: React.FC<WhiteboardOverlayProps> = ({
  visible,
  role,
  strokes,
  liveStroke,
  backgroundImage,
  penColor,
  penWidth,
  tool,
  onCommitStroke,
  onProgressStroke,
  onUndo,
  onClear,
  onPickImage,
  onClose,
  onPenColorChange,
  onPenWidthChange,
  onToolChange,
}) => {
  const isTeacher = role === 'teacher';
  const [showToolbar, setShowToolbar] = useState(true);
  const canvasRef = useRef<View>(null);
  const currentStrokeRef = useRef<WhiteboardStroke | null>(null);
  const pointBatchRef = useRef<WhiteboardPoint[]>([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTeacher,
      onMoveShouldSetPanResponder: () => isTeacher,
      onPanResponderGrant: (evt) => {
        if (!isTeacher || !canvasRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        canvasRef.current.measure((_x, _y, w, h) => {
          if (w === 0 || h === 0) return;
          const newStroke: WhiteboardStroke = {
            id: nextStrokeId(),
            points: [{ x: locationX / w, y: locationY / h }],
            color: tool === 'eraser' ? '#FFFFFF' : penColor,
            width: tool === 'eraser' ? penWidth * 3 : penWidth,
            tool,
          };
          currentStrokeRef.current = newStroke;
          pointBatchRef.current = [];
        });
      },
      onPanResponderMove: (evt) => {
        if (!isTeacher || !currentStrokeRef.current || !canvasRef.current) return;
        const { locationX, locationY } = evt.nativeEvent;
        canvasRef.current.measure((_x, _y, w, h) => {
          if (w === 0 || h === 0) return;
          const pt = { x: locationX / w, y: locationY / h };
          currentStrokeRef.current!.points.push(pt);
          pointBatchRef.current.push(pt);
          if (onProgressStroke && pointBatchRef.current.length >= 5) {
            pointBatchRef.current = [];
            onProgressStroke({ ...currentStrokeRef.current! });
          }
        });
      },
      onPanResponderRelease: () => {
        if (!isTeacher || !currentStrokeRef.current) return;
        if (onCommitStroke && currentStrokeRef.current.points.length > 0) {
          onCommitStroke(currentStrokeRef.current);
        }
        currentStrokeRef.current = null;
        pointBatchRef.current = [];
      },
    }),
  ).current;

  if (!visible) return null;

  const allStrokes = liveStroke ? [...strokes, liveStroke] : strokes;

  return (
    <View style={styles.container} pointerEvents="auto">
      <View
        style={styles.canvasArea}
        ref={canvasRef}
        {...(isTeacher ? panResponder.panHandlers : {})}
      >
        {backgroundImage ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${backgroundImage}` }}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.emptyBoard}>
            <Ionicons name="brush" size={48} color="#374151" />
            <Text style={styles.emptyBoardText}>
              {isTeacher ? 'Draw here to explain' : "Teacher's whiteboard"}
            </Text>
          </View>
        )}
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          {allStrokes.map((stroke) =>
            stroke.points.length < 2 ? (
              <Circle
                key={stroke.id}
                cx={stroke.points[0]?.x ?? 0}
                cy={stroke.points[0]?.y ?? 0}
                r={stroke.width / 2}
                fill={stroke.color}
              />
            ) : (
              <Path
                key={stroke.id}
                d={pointsToPath(stroke.points)}
                stroke={stroke.color}
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ),
          )}
        </Svg>
      </View>

      {isTeacher && showToolbar && (
        <View style={styles.toolbar}>
          <View style={styles.toolRow}>
            {PEN_COLORS.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  penColor === c && tool === 'pen' && styles.colorDotActive,
                ]}
                onPress={() => {
                  onPenColorChange?.(c);
                  onToolChange?.('pen');
                }}
              />
            ))}
            <View style={styles.divider} />
            {PEN_WIDTHS.map((w) => (
              <Pressable
                key={w}
                style={[styles.widthDot, penWidth === w && styles.widthDotActive]}
                onPress={() => onPenWidthChange?.(w)}
              >
                <View
                  style={[
                    styles.widthDotInner,
                    { width: w + 4, height: w + 4, backgroundColor: penWidth === w ? '#FFF' : '#9CA3AF' },
                  ]}
                />
              </Pressable>
            ))}
            <View style={styles.divider} />
            <Pressable
              style={[styles.toolBtn, tool === 'eraser' && styles.toolBtnActive]}
              onPress={() => onToolChange?.('eraser')}
            >
              <Ionicons name="remove" size={20} color={tool === 'eraser' ? '#FFF' : '#9CA3AF'} />
            </Pressable>
            <Pressable style={styles.toolBtn} onPress={onUndo}>
              <Ionicons name="arrow-undo" size={20} color="#9CA3AF" />
            </Pressable>
            <Pressable style={styles.toolBtn} onPress={onClear}>
              <Ionicons name="trash" size={20} color="#9CA3AF" />
            </Pressable>
          </View>
          <Pressable style={styles.annotateBtn} onPress={onPickImage}>
            <Ionicons name="image" size={16} color="#2563EB" />
            <Text style={styles.annotateBtnText}>Annotate local notes</Text>
          </Pressable>
          {backgroundImage && (
            <Text style={styles.annotateHint}>Annotation mode — draw on your notes</Text>
          )}
        </View>
      )}

      <View style={styles.topBar}>
        <View style={styles.roleBadge}>
          <Ionicons
            name={isTeacher ? 'brush' : 'eye'}
            size={14}
            color={isTeacher ? '#059669' : '#6B7280'}
          />
          <Text style={styles.roleBadgeText}>
            {isTeacher ? 'Whiteboard (Teacher)' : 'Whiteboard (View)'}
          </Text>
        </View>
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={22} color="#FFF" />
        </Pressable>
      </View>

      {isTeacher && (
        <Pressable
          style={styles.toggleToolbarBtn}
          onPress={() => setShowToolbar((p) => !p)}
        >
          <Ionicons
            name={showToolbar ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#FFF"
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    backgroundColor: '#F3F4F6',
  },
  canvasArea: {
    flex: 1,
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  emptyBoard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyBoardText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotActive: {
    borderColor: '#2563EB',
    borderWidth: 3,
  },
  widthDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widthDotActive: {
    backgroundColor: '#DBEAFE',
  },
  widthDotInner: {
    borderRadius: 999,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  toolBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  toolBtnActive: {
    backgroundColor: '#111827',
  },
  annotateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  annotateBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  annotateHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  toggleToolbarBtn: {
    position: 'absolute',
    bottom: 150,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
