<?php
// modules/frontoffice/informasi_tamu/_guest_registration_query.php

/**
 * Fetches guest registration data from the database with dynamic filtering, sorting, and pagination.
 *
 * @param PDO $pdo The database connection object.
 * @param array $where_clauses An array of SQL WHERE conditions.
 * @param array $params An array of parameters to bind to the SQL query.
 * @param string $sort_column The column to sort by.
 * @param string $sort_order The sort order ('ASC' or 'DESC').
 * @param int $page The current page number.
 * @param int $entries The number of entries per page.
 * @return array An associative array containing the fetched registrations, total record count, and total pages.
 */
function get_guest_registrations($pdo, $where_clauses, $params, $sort_column, $sort_order, $page, $entries) {
    $offset = ($page - 1) * $entries;
    $where_sql = 'WHERE ' . implode(' AND ', $where_clauses);

    // Get total record count for pagination
    $sql_count = "SELECT COUNT(*) FROM guest_registrations $where_sql";
    $stmt_count = $pdo->prepare($sql_count);
    $stmt_count->execute($params);
    $total_records = $stmt_count->fetchColumn();
    $total_pages = ceil($total_records / $entries);

    // Fetch the data for the current page
    $sql_data = "SELECT *, (guest_count_male + guest_count_female + guest_count_child) as total_ci FROM guest_registrations $where_sql ORDER BY $sort_column $sort_order LIMIT :limit OFFSET :offset";
    
    $stmt_data = $pdo->prepare($sql_data);
    
    // Bind parameters, ensuring correct types
    foreach ($params as $key => &$val) {
        $stmt_data->bindParam($key, $val);
    }
    $stmt_data->bindValue(':limit', (int)$entries, PDO::PARAM_INT);
    $stmt_data->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
    
    $stmt_data->execute();
    $registrations = $stmt_data->fetchAll(PDO::FETCH_ASSOC);

    return [
        'registrations' => $registrations,
        'total_records' => $total_records,
        'total_pages' => $total_pages,
    ];
}
?>