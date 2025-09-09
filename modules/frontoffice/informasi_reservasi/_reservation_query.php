<?php
// modules/frontoffice/informasi_reservasi/_reservation_query.php

function get_reservations($pdo, $sql_count, $sql_data, $params, $sort_column, $sort_order, $page, $entries) {
    $offset = ($page - 1) * $entries;

    $stmt_count = $pdo->prepare($sql_count);
    $stmt_count->execute($params);
    $total_records = $stmt_count->fetchColumn();
    $total_pages = ceil($total_records / $entries);

    $sql_data .= " ORDER BY $sort_column $sort_order LIMIT :limit OFFSET :offset";

    $stmt_data = $pdo->prepare($sql_data);
    $stmt_data->bindValue(':limit', (int)$entries, PDO::PARAM_INT);
    $stmt_data->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
    foreach ($params as $key => &$val) {
        $stmt_data->bindParam($key, $val);
    }
    
    $stmt_data->execute();
    $reservations = $stmt_data->fetchAll(PDO::FETCH_ASSOC);

    return [
        'reservations' => $reservations,
        'total_records' => $total_records,
        'total_pages' => $total_pages,
    ];
}
?>