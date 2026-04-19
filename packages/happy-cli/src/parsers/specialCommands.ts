/**
 * Parsers for special commands that require dedicated remote session handling
 */

export interface CompactCommandResult {
    isCompact: boolean;
    originalMessage: string;
}

export interface ClearCommandResult {
    isClear: boolean;
}

export interface ModelCommandResult {
    isModel: boolean;
    modelName?: string;
}

export interface SpecialCommandResult {
    type: 'compact' | 'clear' | 'model' | null;
    originalMessage?: string;
    modelName?: string;
}

/**
 * Parse /compact command
 * Matches messages starting with "/compact " or exactly "/compact"
 */
export function parseCompact(message: string): CompactCommandResult {
    const trimmed = message.trim();
    
    if (trimmed === '/compact') {
        return {
            isCompact: true,
            originalMessage: trimmed
        };
    }
    
    if (trimmed.startsWith('/compact ')) {
        return {
            isCompact: true,
            originalMessage: trimmed
        };
    }
    
    return {
        isCompact: false,
        originalMessage: message
    };
}

/**
 * Parse /clear command
 * Only matches exactly "/clear"
 */
export function parseClear(message: string): ClearCommandResult {
    const trimmed = message.trim();
    
    return {
        isClear: trimmed === '/clear'
    };
}

/**
 * Parse /model command
 * Matches "/model" (show current) or "/model <name>" (set model)
 */
export function parseModel(message: string): ModelCommandResult {
    const trimmed = message.trim();
    if (trimmed === '/model') {
        return { isModel: true };
    }
    if (trimmed.startsWith('/model ')) {
        const modelName = trimmed.slice('/model '.length).trim();
        return { isModel: true, modelName: modelName || undefined };
    }
    return { isModel: false };
}

/**
 * Unified parser for special commands
 * Returns the type of command and original message if applicable
 */
export function parseSpecialCommand(message: string): SpecialCommandResult {
    const compactResult = parseCompact(message);
    if (compactResult.isCompact) {
        return {
            type: 'compact',
            originalMessage: compactResult.originalMessage
        };
    }

    const clearResult = parseClear(message);
    if (clearResult.isClear) {
        return {
            type: 'clear'
        };
    }

    const modelResult = parseModel(message);
    if (modelResult.isModel) {
        return {
            type: 'model',
            modelName: modelResult.modelName
        };
    }

    return {
        type: null
    };
}