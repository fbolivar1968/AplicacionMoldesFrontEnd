import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import '../styles/globals.css';




export default function PaginationRounded() {
    const data = [];
    const handlePageChange = (event, value) => {
        data.setPageIndex(value - 1);
    };
    return (
        <div className="pagination">
            <Stack spacing={2}>
                <Pagination
                    shape="rounded" color="blueFB"
                    //count={data.getPageCount()}
                    //page={data.getState().pagination.pageIndex + 1}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton/>

            </Stack>

        </div>

    );
}

