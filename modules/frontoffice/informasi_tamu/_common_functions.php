<?php
// modules/frontoffice/informasi_tamu/_common_functions.php

function get_sort_link($column, $display, $current_sort, $current_order) {
    $order = ($current_sort == $column && $current_order == 'ASC') ? 'DESC' : 'ASC';
    $arrow = ($current_sort == $column) ? ($current_order == 'ASC' ? '▲' : '▼') : '';
    // Preserve other GET parameters when creating the link
    $query_params = http_build_query(array_merge($_GET, ['sort' => $column, 'order' => $order]));
    return "<a href=\"?{$query_params}\">$display $arrow</a>";
}

function get_registration_data($pdo, $where_clauses, $params, $sort_column, $sort_order, $page, $entries) {
    try {
        $result = get_guest_registrations($pdo, $where_clauses, $params, $sort_column, $sort_order, $page, $entries);
        return [
            'registrations' => $result['registrations'],
            'total_records' => $result['total_records'],
            'total_pages' => $result['total_pages'],
            'offset' => ($page - 1) * $entries,
            'error_message' => ''
        ];
    } catch (PDOException $e) {
        return [
            'registrations' => [],
            'total_records' => 0,
            'total_pages' => 0,
            'offset' => 0,
            'error_message' => "Database error: " . $e->getMessage()
        ];
    }
}
?>
