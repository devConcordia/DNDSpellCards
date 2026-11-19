export const fonts = {
	NORMAL: 'normal normal',
	BOLD: 'normal bold',
	ITALIC: 'italic normal',
	BOLD_ITALIC: 'italic bold'
};

/**
 * Converte Y do sistema PDF (origem embaixo) para o sistema Canvas (origem no topo).
 */
export function toCanvasY(y, height) {
	return height - y;
}
