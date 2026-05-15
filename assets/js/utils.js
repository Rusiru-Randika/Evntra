/**
 * Conflict Checker
 * Checks for scheduling conflicts between competitions
 */

const ConflictChecker = {
    /**
     * Check if a competition conflicts with existing registrations
     */
    checkConflict: async (competitionId) => {
        try {
            const response = await fetch('/api/check-conflict.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ competition_id: competitionId })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Conflict check error:', error);
            throw error;
        }
    },

    /**
     * Display conflict warning
     */
    showConflictWarning: (conflicts) => {
        if (!conflicts || conflicts.length === 0) return false;

        const message = `⚠️ Time Conflict Detected!\n\nYour registration conflicts with:\n${
            conflicts.map(c => `• ${c.title} (${c.startDate} - ${c.endDate})`).join('\n')
        }\n\nDo you want to continue?`;

        return confirm(message);
    },

    /**
     * Get conflict details
     */
    getConflictDetails: (comp1, comp2) => {
        const start1 = new Date(comp1.startDate);
        const end1 = new Date(comp1.endDate);
        const start2 = new Date(comp2.startDate);
        const end2 = new Date(comp2.endDate);

        // Check for time overlap
        if (start1 < end2 && end1 > start2) {
            return {
                hasConflict: true,
                overlapStart: Math.max(start1, start2),
                overlapEnd: Math.min(end1, end2),
                conflictDays: Math.ceil(
                    (Math.min(end1, end2) - Math.max(start1, start2)) / (1000 * 60 * 60 * 24)
                )
            };
        }

        return { hasConflict: false };
    }
};

/**
 * Search & Filter System
 */
const SearchFilter = {
    /**
     * Search competitions by query
     */
    search: async (query) => {
        try {
            const response = await fetch(`/api/competitions.php?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.competitions || [];
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    },

    /**
     * Filter competitions by category
     */
    filterByCategory: async (category) => {
        try {
            const response = await fetch(`/api/competitions.php?category=${category}`);
            const data = await response.json();
            return data.competitions || [];
        } catch (error) {
            console.error('Filter error:', error);
            return [];
        }
    },

    /**
     * Filter by difficulty level
     */
    filterByDifficulty: async (difficulty) => {
        try {
            const response = await fetch(`/api/competitions.php?difficulty=${difficulty}`);
            const data = await response.json();
            return data.competitions || [];
        } catch (error) {
            console.error('Filter error:', error);
            return [];
        }
    },

    /**
     * Filter by date range
     */
    filterByDateRange: async (startDate, endDate) => {
        try {
            const response = await fetch(
                `/api/competitions.php?startDate=${startDate}&endDate=${endDate}`
            );
            const data = await response.json();
            return data.competitions || [];
        } catch (error) {
            console.error('Filter error:', error);
            return [];
        }
    },

    /**
     * Advanced filtering
     */
    advancedFilter: async (filters) => {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });

            const response = await fetch(`/api/competitions.php?${params.toString()}`);
            const data = await response.json();
            return data.competitions || [];
        } catch (error) {
            console.error('Filter error:', error);
            return [];
        }
    }
};

/**
 * Pagination System
 */
const Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,

    /**
     * Calculate total pages
     */
    getTotalPages: function() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    },

    /**
     * Get paginated items
     */
    getPaginatedItems: function(items) {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return items.slice(start, end);
    },

    /**
     * Generate pagination HTML
     */
    generatePaginationHTML: function(totalItems, currentPage = 1) {
        this.totalItems = totalItems;
        this.currentPage = currentPage;
        const totalPages = this.getTotalPages();

        let html = '<div class="pagination" style="display: flex; gap: 5px; justify-content: center; margin-top: 20px;">';

        // Previous button
        if (currentPage > 1) {
            html += `<a href="#" onclick="Pagination.goToPage(${currentPage - 1})" class="btn btn-small">← Previous</a>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                html += `<button class="btn btn-primary btn-small" disabled>${i}</button>`;
            } else {
                html += `<a href="#" onclick="Pagination.goToPage(${i})" class="btn btn-secondary btn-small">${i}</a>`;
            }
        }

        // Next button
        if (currentPage < totalPages) {
            html += `<a href="#" onclick="Pagination.goToPage(${currentPage + 1})" class="btn btn-small">Next →</a>`;
        }

        html += '</div>';
        return html;
    },

    /**
     * Go to page
     */
    goToPage: function(page) {
        this.currentPage = page;
        // Trigger page change event
        window.dispatchEvent(new CustomEvent('pageChange', { detail: { page } }));
    }
};

/**
 * Sorting System
 */
const Sorting = {
    /**
     * Sort by date ascending
     */
    sortByDateAsc: (items) => {
        return items.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    },

    /**
     * Sort by date descending
     */
    sortByDateDesc: (items) => {
        return items.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    },

    /**
     * Sort by title
     */
    sortByTitle: (items) => {
        return items.sort((a, b) => a.title.localeCompare(b.title));
    },

    /**
     * Sort by participants
     */
    sortByParticipants: (items) => {
        return items.sort((a, b) => (b.participants || 0) - (a.participants || 0));
    },

    /**
     * Sort by relevance (search score)
     */
    sortByRelevance: (items) => {
        return items.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }
};

/**
 * Export functionality
 */
const Exporter = {
    /**
     * Export data as CSV
     */
    exportAsCSV: (data, filename = 'export.csv') => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes if contains comma
                    return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                        ? `"${value.replace(/"/g, '""')}"`
                        : value;
                }).join(',')
            )
        ].join('\n');

        Exporter.downloadFile(csv, filename, 'text/csv');
    },

    /**
     * Export data as JSON
     */
    exportAsJSON: (data, filename = 'export.json') => {
        const json = JSON.stringify(data, null, 2);
        Exporter.downloadFile(json, filename, 'application/json');
    },

    /**
     * Download file helper
     */
    downloadFile: (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};

/**
 * Export all utilities
 */
export { ConflictChecker, SearchFilter, Pagination, Sorting, Exporter };
